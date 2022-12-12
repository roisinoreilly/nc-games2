const apiRouter = require("express").Router()
const { getAPI } = require("../controllers/api.controller")
const categoriesRouter = require("./categories.router")
const commentsRouter = require("./comments.router")
const reviewsRouter = require("./reviews.router")
const usersRouter = require("./users.router")

apiRouter.use("/", getAPI)
apiRouter.use("/reviews", reviewsRouter)
apiRouter.use("/comments", commentsRouter)
apiRouter.use("/categories", categoriesRouter)
apiRouter.use("/users", usersRouter)

module.exports = apiRouter