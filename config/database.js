const mongoose = require('mongoose')

function connectDatabase() {
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
}

module.exports = connectDatabase