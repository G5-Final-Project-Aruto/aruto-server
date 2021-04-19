const { Schema, model, ObjectId } = require("mongoose");

const transactionSchema = Schema({
  arts: [
    {
      id: {
        type: ObjectId,
        required: true,
      },
      item: {
        type: String,
        required: true,
      },
      size: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        required: true,
      },
      position: {
        left: {
          type: Number,
          required: true,
        },
        top: {
          type: Number,
          required: true,
        },
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
