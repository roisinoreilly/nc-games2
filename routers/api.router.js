const apiRouter = require("express").Router()
const { getCategories } = require("../controllers/categories.controller")
const commentsRouter = require("./comments.router")
const reviewsRouter = require("./reviews.router")

apiRouter.use("/reviews", reviewsRouter)
apiRouter.use("/comments", commentsRouter)
apiRouter.use("/categories", getCategories)

module.exports = apiRouter