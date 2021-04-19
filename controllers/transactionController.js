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

      const transactionToken = await snap.createTransactionToken({
        transaction_details: {
          order_id: uuidv4(),
          gross_amount,
        },
        enabled_payments: ["credit_card"],
      });

      res.status(201).json({
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
      if (!req.body.transactionId) {
        throw { name: "transactionId is required" };
      }
      const { transactionId } = req.body;

      const transaction = await Transaction.findOne({ _id: transactionId });

      if (!transaction) {
        throw { name: "Transaction is not found" };
      }

      if (`${transaction.UserId}` !== `${req.currentUser._id}`) {
        throw { name: "Unauthorize user" };
      }

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
      next(err);
    }
  }
}

module.exports = TransactionController;
