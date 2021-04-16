const { Schema, model, ObjectId } = require("mongoose");

const userSchema = Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  full_name: {
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

module.exports = model("User", userSchema);
