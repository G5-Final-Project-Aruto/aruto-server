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

let transactionToken;

class TransactionController {
  static async transactionCreate (req,res,next) {
    try {
      console.log(req.currentUser, 'INI CURRENT USER')
      console.log(req.body, 'INI TEST ')
      const input = {
        transaction_details:{    
          order_id: uuidv4(),
          gross_amount: +req.body.gross_amount, 
          address: req.body.address 
        },
        
      }
      const data = {
          arts: req.body.arts,
          gross_amount: +req.body.gross_amount,
          address: req.body.address,
          status:"pending",
          UserId: req.currentUser._id
      }
      // const transaction = await Transaction.create(input);
      let snap = new midtransClient.Snap({
        // Set to true if you want Production Environment (accept real transaction).
        isProduction : false,
        serverKey : serverKey,
        clientKey : clientKey
      });
      
      const Token = snap.createTransaction(input)
      .then (transaction => {
        console.log(input)
        // transaction token
        transactionToken = transaction;
        console.log('transactionToken:',transactionToken);
        return  Transaction.create(data)
      })
      .then( result => {   
        res.status(201).json({transactionToken,result})
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