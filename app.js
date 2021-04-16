if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes");
const { errorHandler } = require("./middlewares");

const app = express();

mongoose
  .connect(
    "mongodb://127.0.0.1:27017/aruto_" + process.env.NODE_ENV + "_server",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((_) => console.log("connect mongodb"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(errorHandler);

module.exports = app;
