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

      await Transaction.create(newTransaction);

      const input = {
        transaction_details: {
          order_id: uuidv4(),
          gross_amount: +req.body.gross_amount,
        },
      };

      const transactionToken = await snap.createTransactionToken();
      const token = snap
        .createTransaction(input)
        .then((transaction) => {
          console.log(input);
          // transaction token
          transactionToken = transaction;
          console.log("transactionToken:", transactionToken);
          return Transaction.create(data);
        })
        .then((result) => {
          res.status(201).json({ transactionToken, result });
        })
        .catch((err) => {
          console.log({ error: err });
        });
    } catch (err) {
      next(err);
    }
  }

  static async transactionSuccess(req, res, next) {
    try {
      Transaction.findOne;
    } catch (err) {}
  }
}

module.exports = TransactionController;
