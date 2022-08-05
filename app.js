const express = require("express");
const app = express();
app.use(express.json());

const { getCategories } = require("./controllers/categories.controller");
const { deleteCommentById } = require("./controllers/comments.controller");
const { getReviewsByID, patchReviewsByID, getReviews, getCommentsByID, postCommentsByID } = require("./controllers/reviews.controller");
const { getUsers } = require("./controllers/users.controller");
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require("./errors");

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewsByID);
app.patch("/api/reviews/:review_id", patchReviewsByID);
app.get("/api/users", getUsers);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id/comments", getCommentsByID);
app.post("/api/reviews/:review_id/comments", postCommentsByID);
app.delete('/api/comments/:comment_id', deleteCommentById);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;