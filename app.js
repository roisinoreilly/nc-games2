const express = require("express");
const app = express();
app.use(express.json());

const { getCategories } = require("./controllers/categories.controller");
const { getReviewsByID, patchReviewsByID } = require("./controllers/reviews.controller");

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewsByID);
app.patch("/api/reviews/:review_id", patchReviewsByID);

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status)
        res.send({msg: err.msg})
  } else next(err)
     if (err.code === '22P02') {
        res.status(400).send({ msg: 'Bad request' })
    } else {
        if (err){
            res.status(500).send({ msg: 'Internal Server Error!' })
        }
    }
})

module.exports = app;