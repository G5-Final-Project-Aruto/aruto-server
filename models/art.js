const { Schema, model, ObjectId } = require("mongoose");

const artSchema = Schema({
  image_url: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  like: [
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
