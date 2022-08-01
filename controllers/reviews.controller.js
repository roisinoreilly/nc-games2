const { selectReviewsByID } = require("../models/reviews.model")

exports.getReviewsByID = (req, res, next) => {
    const { review_id } = req.params
    selectReviewsByID(review_id).then((review) => {
        res.status(200).send({ review })
    })
    .catch(next)
}