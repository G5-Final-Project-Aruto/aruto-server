const {Transaction} = require('../models')
const midtransClient = require('midtrans-client')
const serverKey = 'SB-Mid-server-OC-CpMu5lkZ2JT7mMyfnvDf0';
const clientKey = 'SB-Mid-client-kOg3pJdjMxNkUPCY'

const { v4: uuidv4} = require('uuid')

let snap = new midtransClient.Snap({
  // Set to true if you want Production Environment (accept real transaction).
  isProduction : false,
  serverKey : serverKey,
  clientKey : clientKey
});

class TransactionController {
  static async transactionCreate (req,res,next) {
    try {
      console.log(req.currentUser, 'INI CURRENT USER')
      console.log(req.body, 'INI TEST ')
      const input = {
        transaction_details:{
          arts: req.body.arts,
          address: req.body.address,
          order_id: uuidv4(),
          gross_amount: req.body.gross_amount,
          status:"pending",
          userId: req.currentUser
        }
      }
      // const transaction = await Transaction.create(input);
      let snap = new midtransClient.Snap({
        // Set to true if you want Production Environment (accept real transaction).
        isProduction : false,
        serverKey : serverKey,
        clientKey : clientKey
      });
      
      const Token = snap.createTransaction(input)
      .then((transaction)=>{
        console.log(input)
        // transaction token
        let transactionToken = transaction;
        console.log('transactionToken:',transactionToken);
        res.status(201).json(transactionToken)
        })
      .catch( err => {
          console.log({error: err})
          })
    } catch (err) {
      next(err);
    }
  }
  
  static async done(req,res,next){
    try{
      Transaction.findOne

    } catch(err) {

    }
  } 
}

module.exports = TransactionController