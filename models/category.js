const { Schema, model } = require("mongoose");

const categorySchema = Schema({
  title: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
});

module.exports = model("Category", categorySchema);
