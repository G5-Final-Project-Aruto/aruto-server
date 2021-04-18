const { Router } = require("express");

const { TransactionController } = require("../controllers");
const {authorization} = require('../middlewares/')

const router = Router();

router.post("/", authorization, TransactionController.transactionCreate);

// router.patch("/finished", authorization, TransactionController.done)
// router.patch("/failed", authorization, TransactionController.failed)

module.exports = router;
