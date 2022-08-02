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

exports.updateReviewsByID = (review_id, reviewPatch) => {
    const {inc_votes} = reviewPatch
    if (inc_votes === undefined) {
        return Promise.reject({status: 400, msg: "Bad request"})
    }
    return db.query("UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;", [inc_votes, review_id])
    .then((result) => {
        if (result.rows[0] === undefined) {
            return Promise.reject({status: 404, msg: "Review does not exist"})
        }
        else {
            return result.rows[0]
        }
    })
}