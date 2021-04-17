const { Schema, model, ObjectId } = require("mongoose");

const { hashPassword } = require("../helpers");

const userSchema = Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
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

userSchema.pre("save", function (next) {
  this.password = hashPassword(this.password);
  next();
});

module.exports = model("User", userSchema);
