const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require("./errors");
const apiRouter = require("./routers/api.router");

app.use("/api", apiRouter)

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;