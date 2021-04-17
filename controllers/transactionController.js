const {Transaction} = require('../models')
// const snap = require('../midtrans')

class TransactionController {

  // static transactionMidtrans(req, res) {
  //   try{
  //     const input = {
  //       transaction_detail: {
  //         order_id: req.body.order_id,
  //         gross_amount: req.body.gross_amount
  //       }
  //     }
  //     const transaction = await Transaction.create(input)

  //     const Token = snap.createTransaction(parameter)
  //         .then((transaction)=>{
  //             // transaction token
  //             let transactionToken = transaction.token;
  //             console.log('transactionToken:',transactionToken);
  //             res.status(200).json({ transactionToken })
  //         })
  //         .catch( err => {
  //           console.log({error: err})
  //         })
  //   } catch (err) {

  //   }
  // }

  static async transactionCreate (req,res,next) {
    try {
      const input = {
        arts: req.body.arts,
        address: req.body.address,
        totalPrice: req.body.totalPrice,
        status:req.body.status,
        userId: 4 //hardcode
      }
      const transaction = await Transaction.create(input);
     
      res.status(201).json({
        arts: transaction.arts,
        address: transaction.address,
        totalPrice: transaction.totalPrice,
        status: transaction.status,
        userId: transaction.userId
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = TransactionController