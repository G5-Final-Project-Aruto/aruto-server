const { Router } = require("express");

const userRouter = require("./userRouter");
const artRouter = require("./artRouter");
const categoryRouter = require("./categoryRouter");
const transactionRouter = require("./transactionRouter");

const router = Router();

router.use("/", userRouter);
router.use("/arts", artRouter);
router.use("/categories", categoryRouter);
router.use("/transaction", transactionRouter);

module.exports = router;
