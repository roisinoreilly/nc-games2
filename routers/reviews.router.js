const reviewsRouter = require("express").Router()
const {getReviewsByID, patchReviewsByID, getReviews, getCommentsByID, postCommentsByID} = require("../controllers/reviews.controller")

reviewsRouter.route("/").get(getReviews)
reviewsRouter.route("/:review_id").get(getReviewsByID)
reviewsRouter.route("/:review_id").patch(patchReviewsByID)
reviewsRouter.route("/:review_id/comments").get(getCommentsByID)
reviewsRouter.post("/:review_id/comments").post(postCommentsByID)

module.exports = reviewsRouter