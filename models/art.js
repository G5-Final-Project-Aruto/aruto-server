const { Schema, model, ObjectId } = require("mongoose");

const artSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  user: {
    type: ObjectId,
    ref: "User",
  },
  likes: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  categories: [
    {
      type: ObjectId,
      ref: "Category",
    },
  ],
});

module.exports = model("Art", artSchema);
