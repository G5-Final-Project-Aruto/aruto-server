const { Schema, model, ObjectId } = require("mongoose");

const transactionSchema = Schema({
    arts: [
      {
        type:String
      },
    ]
    ,
    gross_amount: {
      type: Number
    },
    address: {
      type: String,
    },
    status: {
      type: String
    },
    UserId :{
      type: ObjectId,
      ref: 'User'
    }
});

module.exports = model("Transaction", transactionSchema);