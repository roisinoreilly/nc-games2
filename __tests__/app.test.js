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
            output.forEach((category) => {
                expect.objectContaining({slug: expect.any(String),
                description: expect.any(String)})
            })
            expect(output.length).toBe(4)
        })
    })
})

describe("GET /api/reviews/:review_id", () => {
    test("GET: 200 sends a review object to the client", () => {
        return request(app)
        .get("/api/reviews/1")
        .expect(200)
        .then((response) => {
            const output = response.body.review
            expect(Object.keys(output).length).toBe(9)
            expect(output).toMatchObject({
                review_id: 1,
                title: 'Agricola',
                category: 'euro game',
                designer: 'Uwe Rosenberg',
                owner: 'mallionaire',
                review_body: 'Farmyard fun!',
                review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                created_at: '2021-01-18T10:00:20.514Z',
                votes: 1
              })
        })
    })
    test("GET:404 sends an appropriate and error message when given a valid but non-existent id", () => {
        return request(app)
        .get("/api/reviews/3000")
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("Review does not exist")
        })
    })
    test("GET:400 sends an appropriate and error message when given an invalid id", () => {
        return request(app)
        .get("/api/reviews/banana")
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("Bad request")
        })
    })
})