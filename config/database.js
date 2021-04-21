const mongoose = require("mongoose");

const URI =
  process.env.NODE_ENV === "test"
    ? "mongodb://127.0.0.1:27017/test_server"
    : process.env.MONGO_URI;

function connectDatabase() {
  mongoose
    .connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((_) => console.log("connect mongodb"))
    .catch((err) => console.log(err));
}

module.exports = connectDatabase;
