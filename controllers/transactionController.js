const midtransClient = require("midtrans-client");
const { v4: uuidv4 } = require("uuid");

const { Transaction } = require("../models");

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: "SB-Mid-server-OC-CpMu5lkZ2JT7mMyfnvDf0",
  clientKey: "SB-Mid-client-kOg3pJdjMxNkUPCY",
});

class TransactionController {
  static async transactionCreate(req, res, next) {
    try {
      const { arts, gross_amount, address } = req.body;
      const newTransaction = {
        arts,
        gross_amount,
        address,
        UserId: req.currentUser._id,
        status: "pending",
      };

      const transaction = await Transaction.create(newTransaction);
      const transactionDetail = 
        {
          transaction_details: {
            order_id: uuidv4(),
            gross_amount,
          },
          enabled_payments: ["bca_va"],
        }   
      const transactionToken = await snap.createTransactionToken(transactionDetail);

      res.status(201).json({
        transactionDetail,
        transactionToken,
        clientKey: snap.apiConfig.clientKey,
        transactionId: transaction._id,
      });
    } catch (err) {
      next(err);
    }
  }

  static async transactionSuccess(req, res, next) {
    try {
      const { transactionId } = req.body;
      await Transaction.updateOne(
        {
          _id: transactionId,
        },
        {
          $set: {
            status: "success",
          },
        }
      );
      res.status(200).json({ message: "Payment succesfully" });
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static check(req,res,next) {
    console.log(req.body,'ini body')
    //request id order
   snap.transaction.status(req.body.transactionId)
   .then(data => {
     console.log(data,'ini data')
    res.status(200).json(data)
   })
   .catch(err =>{
     res.status(err)
   })
  }


  static checkManual(req,res,next) {
    //request id order
   console.log(req.params.id,"INI PARAMS")
   snap.transaction.status(req.params.id)
   .then(data => {
     console.log(data,'INI DATA')
    res.status(200).json(data)
   })
   .catch(err =>{
     console.log('ini error', err)
     res.status(err)
   })
  }

  static async transactionPending(req, res, next) {
    try {
      const { transactionId } = req.body;
      await Transaction.updateOne(
        {
          _id: transactionId,
        },
        {
          $set: {
            status: "onPending",
          },
        }
      );
      res.status(200).json({ message: "Payment on Pending" });
    } catch (err) {
      res.status(500).json(err);
    }
  }


  static async transactionError(req, res, next) {
    try {
      const { transactionId } = req.body;
      await Transaction.updateOne(
        {
          _id: transactionId,
        },
        {
          $set: {
            status: "onPending",
          },
        }
      );
      res.status(200).json({ message: "Payment on Pending" });
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

module.exports = TransactionController;
