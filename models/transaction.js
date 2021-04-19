const { Schema, model, ObjectId } = require("mongoose");

const transactionSchema = Schema({
  arts: [
    {
      id: {
        type: ObjectId,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      position: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  gross_amount: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
  },
  UserId: {
    type: ObjectId,
    ref: "User",
  },
});

module.exports = model("Transaction", transactionSchema);
