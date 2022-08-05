const { removeCommentById } = require("../models/comments.model");

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    removeCommentById(comment_id)
      .then((result) => {
        res.status(204).send({ result });
      })
      .catch(next);
  };