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
        return request(app)
        .get("/api/categories")
        .expect(200)
        .then((response) => {
            const output = response.body.categories
            console.log(output)
            output.forEach((category) => {
                expect.objectContaining({slug: expect.any(String),
                description: expect.any(String)})
            })
            expect(output.length).toBe(4)
        })
    })
})