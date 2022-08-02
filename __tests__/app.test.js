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
    test("GET:200 sends a review response object with a comment count key and value", () => {
        return request(app)
        .get("/api/reviews/2")
        .expect(200)
        .then((response) => {
            const output = response.body.review
            expect(output.hasOwnProperty("comment_count")).toBe(true)
            expect.objectContaining({"comment_count": "3"})
    })
    })
    test("GET:404 sends an appropriate error message when given a valid but non-existent review id", () => {
        return request(app)
        .get("/api/reviews/3000")
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("Review does not exist")
        })
    })
    test("GET:400 sends an appropriate error message when given an invalid review id", () => {
        return request(app)
        .get("/api/reviews/banana")
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("Bad request")
        })
    })
})

describe("PATCH /api/reviews/:review_id", () => {
    test("PATCH:200 sends updated review to the client", () => {
        const reviewVotes = {
            inc_votes: 100
        }
        return request(app)
        .patch("/api/reviews/1")
        .send(reviewVotes)
        .expect(200)
        .then(({body: {review}}) => {
            expect(review.votes).toBe(101)
        })
    })
    test("PATCH:404 sends an appropriate error message when given a valid but non-existent review id", () => {
        const reviewVotes = {
            inc_votes: 100
        }
        return request(app)
        .patch("/api/reviews/3000")
        .send(reviewVotes)
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("Review does not exist")
        })
    })
    test("PATCH:400 sends an appropriate error message when given an invalid review id", () => {
        const reviewVotes = {
            inc_votes: 100
        }
        return request(app)
        .patch("/api/reviews/banana")
        .send(reviewVotes)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("Bad request")
        })
    })
    test("PATCH:400 sends an appropriate error message when given an invalid inc_votes object", () => {
        const reviewVotes = {
            inc_votes: "banana"
        }
        return request(app)
        .patch("/api/reviews/1")
        .send(reviewVotes)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("Bad request")
        })
    })
    test("PATCH:400 sends an appropriate error message when given an empty request object", () => {
        const reviewVotes = {}
        return request(app)
        .patch("/api/reviews/1")
        .send(reviewVotes)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("Bad request")
        })
    })
    test("PATCH:400 sends error message when given incorrect key on request body", () => {
        const reviewVotes = {
            banana: 100
        }
        return request(app)
        .patch("/api/reviews/1")
        .send(reviewVotes)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("Bad request")
        })
    })
})

describe("GET /api/users", () => {
    test("GET:200 sends an array of user objects to the client", () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
            const output = response.body.users
            output.forEach((user) => {
                expect.objectContaining({username: expect.any(String),
                name: expect.any(String), avatar_url: expect.any(String)})
            })
            expect(output.length).toBeGreaterThan(1)
        })
    })
})