const db = require("../db/connection")

exports.selectReviewsByID = (review_id) => {
    return db.query(`SELECT reviews.*, COUNT(comments.review_id) AS comment_count
    FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id
    WHERE reviews.review_id = $1 GROUP BY reviews.review_id;`, [review_id])
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

exports.selectAllReviews = (sort_by, order_by, category) => {
    if (![
        'owner',
        'title',
        'review_id',
        'category',
        'created_at',
        'votes',
        'comment_count',
      ].includes(sort_by)) {
        return Promise.reject({ status: 400, msg: 'Invalid sort query' });
      }
      if (!['asc', 'desc', 'ASC', 'DESC'].includes(order_by)) {
        return Promise.reject({ status: 400, msg: 'Invalid order query' });
      }
      if (category != undefined) {
        if (!["strategy",
        "hidden-roles",
        "dexterity",
        "push-your-luck",
        "roll-and-write",
        "deck-building",
        "engine-building",
        "euro game",
        "social deduction",
        "children's games"].includes(category)) {
            return Promise.reject({status: 404, msg: "Invalid category"})
        }
      }
      let queryArray = []
      let queryString = `SELECT reviews.*, COUNT(comments.review_id) AS comment_count
      FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id `
      if (!category) {
        queryString += `GROUP BY reviews.review_id
        ORDER BY ${sort_by} ${order_by}`
      } else {
        queryString += `WHERE reviews.category=$1 GROUP BY reviews.review_id ORDER BY ${sort_by} ${order_by}`
        queryArray.push(category)
      }
      return db.query(queryString + `;`, queryArray)
      .then((result) => {
        return result.rows
    })
}

exports.selectCommentsByID = (review_id) => {
    const reviewsByID = db.query(`SELECT review_id FROM reviews WHERE review_id=$1`, [review_id])
    const commentsbyID = db.query(`SELECT * FROM comments WHERE review_id = $1;`, [review_id])

    return Promise.all([reviewsByID, commentsbyID]).then(([reviewsResults, commentsResults]) => {
        if (reviewsResults.rows.length >0 && commentsResults.rows.length >= 0) {
            return commentsResults.rows
        } else {
            return Promise.reject({status: 404, msg: "Review does not exist"})
        }
    })
}

exports.insertCommentByID = (review_id, username, body) => {
    if (typeof body != "string" || body.length <1) {
        return Promise.reject({status: 400, msg: "Invalid comment"})
    }
    return db.query(`SELECT review_id FROM reviews WHERE review_id=$1`, [review_id])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({status: 404, msg: "Review not found"})
        }
        return db.query(`SELECT username FROM users WHERE username = $1`, [username])
    })
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({status: 400, msg: "Bad request"})
        }
        return db.query(`INSERT INTO comments (body, review_id, author)
        VALUES ($1, $2, $3)
        RETURNING *;`, [body, review_id, username])
    })
    .then((result) => {
        return result.rows[0]
    })
}

