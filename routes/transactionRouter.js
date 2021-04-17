const { Router } = require("express");

const { TransactionController } = require("../controllers");

const router = Router();

router.post("/", TransactionController.transactionCreate);

module.exports = router;
