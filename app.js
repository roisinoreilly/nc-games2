const express = require("express");
const app = express();
app.use(express.json());

const {getCategories} = require("./controllers/categories.controller")

app.get("/api/categories", getCategories);

module.exports = app;