const { Router } = require("express");

const { CategoryController } = require("../controllers");

const router = Router();

router.get("/", CategoryController.getAllCategories);

module.exports = router;
