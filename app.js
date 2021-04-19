if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");

const router = require("./routes");
const { errorHandler } = require("./middlewares");
const connectDatabase = require("./config/database");

const app = express();

connectDatabase();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(errorHandler);

module.exports = app;
