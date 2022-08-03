const { selectReviewsByID, updateReviewsByID, selectAllReviews } = require("../models/reviews.model")

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
    selectAllReviews().then((reviews) => {
        res.status(200).send({reviews})
    })
}