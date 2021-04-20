const { Router } = require("express");

const { TransactionController } = require("../controllers");
const { authorization } = require("../middlewares/");

const router = Router();

router.use(authorization);
router.post("/", TransactionController.transactionCreate);
router.post("/success", TransactionController.transactionSuccess);
router.get("/history", TransactionController.transactionHistory);

module.exports = router;
