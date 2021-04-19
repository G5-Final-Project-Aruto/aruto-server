const { Router } = require("express");

const { UserController } = require("../controllers");

const { authorization } = require("../middlewares")

const router = Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/users", UserController.getAllUsers)
router.get("/user/:id", authorization, UserController.getUser);

module.exports = router;
