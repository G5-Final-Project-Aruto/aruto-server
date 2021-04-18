const { Schema, model, ObjectId } = require("mongoose");

const transactionSchema = Schema({
  // arts: [
  //   {

  //     type:String
  //   },
  // ]
  
  // ,
  // totalPrice: {
  //   type: Number
  // },
  // address: {
  //   type: String,
  //   required: true
  // },
  // status: {
  //   type: String
  // },
  // User :{
  //   type: ObjectId,
  //   ref: 'User'
  // }
  transaction_details:{
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
      required: true
    },
    status: {
      type: String
    },
    User :{
      type: ObjectId,
      ref: 'User'
    }

  }
});

module.exports = model("Transaction", transactionSchema);