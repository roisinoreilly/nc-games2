const db = require("../db/connection")

exports.selectReviewsByID = (review_id) => {
    return db.query('SELECT * FROM reviews WHERE review_id = $1;', [review_id])
    .then((result) => {
        if (result.rows[0] === undefined) {
            return Promise.reject({status: 404, msg: "Review does not exist"})
        }
        else {
            return result.rows[0]
        }
    })
}