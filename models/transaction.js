const { Schema, model, ObjectId } = require("mongoose");

const transactionSchema = Schema({
  arts: [
    {
      type: ObjectId,
      ref: "Art",
    },
  ],
  totalPrice: {
    type: Number
  },
  address: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  User :{
    type: ObjectId,
    ref: 'User'
  }
});

module.exports = model("Transaction", transactionSchema);