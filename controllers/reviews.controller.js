const { selectReviewsByID, updateReviewsByID, selectAllReviews, selectCommentsByID, insertCommentByID } = require("../models/reviews.model")

exports.getReviewsByID = (req, res, next) => {
    const { review_id } = req.params
    selectReviewsByID(review_id).then((review) => {
        res.status(200).send({ review })
    })
    .catch(next)
}

exports.patchReviewsByID = (req, res, next) => {
    const { review_id } = req.params
    const { body } = req
    updateReviewsByID(review_id, body).then((review) => {
        res.status(200).send({review})
    })
    .catch(next)
}

exports.getReviews = (req, res, next) => {
    const sort_by = req.query.sort_by || "created_at"
    const order_by = req.query.order_by || "DESC"
    const category = req.query.category

    selectAllReviews(sort_by, order_by, category).then((reviews) => {
        res.status(200).send({reviews})
    })
    .catch(next)
}

exports.getCommentsByID = (req, res, next) => {
    const { review_id } = req.params
    selectCommentsByID(review_id).then((comments) => {
        res.status(200).send({comments})
    })
    .catch(next)
}

exports.postCommentsByID = (req, res, next) => {
    const { review_id } = req.params
    const { username, body } = req.body
    insertCommentByID(review_id, username, body).then((comment) => {
        res.status(201).send({comment})
    })
    .catch(next)
}