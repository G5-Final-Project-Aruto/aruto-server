const { request } = require("express");

const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userController')

router.get('/', (req, res) => {
  res.send('Aruto Server')
})
router.post('/register', UserController.register)
router.post('/login', UserController.login)

module.exports = router