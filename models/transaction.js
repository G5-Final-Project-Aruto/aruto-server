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
  createdAt: {
    type: Date, default: Date.now
  }
});

module.exports = model("Transaction", transactionSchema);