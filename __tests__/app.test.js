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
    test("GET:200 sends an array of categories to the client", () => {
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
    test("GET:200 sends a review object to the client", () => {
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

describe("GET /api/reviews", () => {
    test("GET:200 sends an array of review objects to the client", () => {
        return request(app)
        .get("/api/reviews")
        .expect(200)
        .then((response) => {
            const output = response.body.reviews
            expect(output.length).toBeGreaterThan(1)
            output.forEach((review) => {
                expect.objectContaining({
                    owner: expect.any(String), 
                    title: expect.any(String), 
                    review_id: expect.any(String), 
                    category: expect.any(String), 
                    review_img_url: expect.any(String), 
                    created_at: expect.toBeDate(), 
                    votes: expect.any(Number), 
                    designer: expect.any(String), 
                    comment_count: expect.any(Number)})
            })
        })
    })
    test("GET:200 sends an array of reviews sorted by date in descending order", () => {
        return request(app)
        .get("/api/reviews")
        .expect(200)
        .then((response) => {
            expect(response.body.reviews).toBeSortedBy("created_at", {descending: true})
    })
})
})

describe("GET /api/reviews/:review_id/comments", () => {
    test("GET:200 sends an array of comments by review id to the client, or an empty array if there are no comments", () => {
        return request(app)
        .get("/api/reviews/3/comments")
        .expect(200)
        .then((response) => {
            const output = response.body.comments
            output.forEach((comment) => {
                expect.objectContaining({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number), created_at: expect.toBeDate(), author: expect.any(String),
                    body: expect.any(String),
                    review_id: expect(3)})
                })
                expect(output.length).toBeGreaterThan(1)
        })
    })
    test("GET:200 sends an empty array to the client if there are no comments for a valid review id", () => {
        return request(app)
        .get("/api/reviews/1/comments")
        .expect(200)
        .then((response) => {
            const output = response.body.comments
            expect(output).toEqual([])
            expect(output.length).toBe(0)
        })
            
    })
    test("GET:404 sends an appropriate error message when given a valid but non-existent review id", () => {
        return request(app)
        .get("/api/reviews/3000/comments")
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("Review does not exist")
        })
    })
    test("GET:400 sends an appropriate error message when given an invalid review id", () => {
        return request(app)
        .get("/api/reviews/banana/comments")
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("Bad request")
        })
})
})

describe("POST /api/reviews/:review_id/comments", () => {
    test("POST:201 sends the posted comment to the client", () => {
        const testComment = {
            username: "mallionaire",  body: "test comment"
        }
        return request(app)
        .post("/api/reviews/1/comments")
        .send(testComment)
        .expect(201)
        .then(({body: {comment}}) => {
            expect(comment).toEqual(
                expect.objectContaining({
                comment_id: 7,
                body: 'test comment',
                review_id: 1,
                author: 'mallionaire',
                votes: 0,
                created_at: expect.any(String)
              }))
        })
    })
    test("POST:404 sends an appropriate error message when given a valid but non-existent review id", () => {
        const testComment = {
            username: "mallionaire",  body: "test comment"
        }
        return request(app)
        .post("/api/reviews/100000/comments")
        .send(testComment)
        .expect(404)
        .then((({body: {msg}}) => {
            expect(msg).toBe("Review not found")
        }))
        })
    // })
    test("POST:400 sends an appropriate error message when given an invalid review id", () => {
        const testComment = {
            username: "mallionaire",  body: "test comment"
        }
        return request(app)
        .post("/api/reviews/banana/comments")
        .send(testComment)
        .expect(400)
        .then((({body: {msg}}) => {
            expect(msg).toBe("Bad request")
        }))
    })
    test("POST:400 sends an appropriate error message when given an empty request body", () => {
        const testComment = {
            username: "mallionaire",  body: ""
        }
        return request(app)
        .post("/api/reviews/1/comments")
        .send(testComment)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("Invalid comment")
        })
    })
    test("POST:400 sends an appropriate error message when given a username not in users database", () => {
        const testComment = {
            username: "invalidUser",  body: "test comment"
        }
        return request(app)
        .post("/api/reviews/1/comments")
        .send(testComment)
        .expect(400)
        .then((({body: {msg}}) => {
            expect(msg).toBe("User not found")
        }))
    })
    test("POST:400 sends an appropriate error message when response body is missing a username property", () => {
        const testComment = {
            body: "test comment"
        }
        return request(app)
        .post("/api/reviews/1/comments")
        .send(testComment)
        .expect(400)
        .then((({body: {msg}}) => {
            expect(msg).toBe("User not found")
        }))
    })
    test("POST:400 sends an appropriate error message when response body is missing a body property", () => {
        const testComment = {
            username: "mallionaire"
        }
        return request(app)
        .post("/api/reviews/1/comments")
        .send(testComment)
        .expect(400)
        .then((({body: {msg}}) => {
            expect(msg).toBe("Invalid comment")
        }))
    })
})