const { Router } = require("express");

const { TransactionController } = require("../controllers");
const { authorization } = require("../middlewares/");

const router = Router();

router.post('/check',TransactionController.check)
router.use(authorization);
router.post("/", TransactionController.transactionCreate);
router.post("/success", TransactionController.transactionSuccess);
router.get('/checkManual/:id',TransactionController.checkManual);

module.exports = router;
