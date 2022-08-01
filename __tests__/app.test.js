//request app data seed db
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data")


beforeEach(() => {
    return seed(data) });

 afterAll(()=> {
        return db.end() });

describe("GET /api/categories", () => {
    test("GET:200 sends an array of teams to the client", () => {
        const expected = [{
            slug: 'euro game',
            description: 'Abstact games that involve little luck'
          },
          {
            slug: 'social deduction',
            description: "Players attempt to uncover each other's hidden role"
          },
          {
            slug: 'dexterity',
            description: 'Games involving physical skill'
          },
          {
            slug: "children's games",
            description: 'Games suitable for children'
          }]
        return request(app)
        .get("/api/categories")
        .expect(200)
        .then((response) => {
            expect(response.body.categories).toEqual(expected)
        })
    })
})