const midtransClient = require("midtrans-client");
const { v4: uuidv4 } = require("uuid");

const { Transaction } = require("../models");

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

class TransactionController {
  static async transactionCreate(req, res, next) {
    try {
      const { arts, gross_amount, address } = req.body;
      const orderId = uuidv4();

      const newTransaction = {
        arts,
        gross_amount,
        address,
        UserId: req.currentUser._id,
        status: "pending",
        orderId,
      };

      await Transaction.create(newTransaction);

      const transactionToken = await snap.createTransactionToken({
        transaction_details: {
          order_id: orderId,
          gross_amount,
        },
        enabled_payments: ["credit_card"],
      });

      res.status(201).json({ transactionToken });
    } catch (err) {
      next(err);
    }
  }

  static async notificationHandler(req, res, next) {
    try {
      const { order_id, transaction_status, fraud_status } = req.body;

      if (!order_id || !transaction_status || !fraud_status) {
        throw { name: "Unauthorize response" };
      }

      const transaction = await Transaction.findOne({ orderId: order_id });

      // check signatureKey hashing

      if (!transaction) {
        throw { name: "Transaction is not found" };
      }

      if (transaction.status !== "pending") {
        throw { name: "Transaction's status is done" };
      }

      let status = "pending";
      if (
        (transaction_status === "capture" && fraud_status === "accept") ||
        transaction_status === "settlement"
      ) {
        transaction.status = "success";
        status = "success";
      }

      if (transaction_status === "cancel" || transaction_status === "expire") {
        transaction.status = "failed";
        status = "failed";
      }

      await transaction.save();

      res.status(200).json({ message: `Transaction is ${status}` });
    } catch (err) {
      next(err);
    }
  }

  static async transactionHistory(req, res, next) {
    try {
      const history = await Transaction.find({
        UserId: req.currentUser._id,
      });
      history.sort((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf());

      res.status(200).json(history);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = TransactionController;
