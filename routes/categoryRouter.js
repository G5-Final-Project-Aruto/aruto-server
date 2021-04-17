const { Router } = require("express");

const { CategoryController } = require("../controllers");

const router = Router();

router.get('/', CategoryController.getAllCategories)
router.get('/:id', CategoryController.getCategory)

module.exports = router;
