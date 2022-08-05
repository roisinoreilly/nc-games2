const db = require("../db/connection")

exports.removeCommentById = (comment_id) => {
    let isNum = /^\d+$/.test(comment_id)
    if (isNum === false) {
        return Promise.reject({ status: 400, msg: "Invalid request"})
    }
    return db
      .query(`SELECT comment_id FROM comments WHERE comment_id=$1`, [comment_id])
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({ status: 404, msg: "Comment not found" });
        }
      })
      .then(() => {
        return db.query(`DELETE FROM comments WHERE comment_id=$1`, [comment_id]);
      })
      .then(({ rows }) => {
        return rows;
      });
  };
  