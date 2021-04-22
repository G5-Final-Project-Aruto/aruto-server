const { Router } = require("express");

const { TransactionController } = require("../controllers");
const { authorization } = require("../middlewares/");

const router = Router();

router.post("/handler", TransactionController.notificationHandler);

router.use(authorization);
router.post("/", TransactionController.transactionCreate);
router.get("/history", TransactionController.transactionHistory);

module.exports = router;
