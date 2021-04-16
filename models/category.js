const { Schema, model, ObjectId } = require("mongoose");

const categorySchema = Schema({
  name: {
    type: String,
    required: true,
  },
  arts: [
    {
      type: ObjectId,
      ref: "Art",
    },
  ],
});

module.exports = model("Category", categorySchema);
