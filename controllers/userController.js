const User = require('../models/user')
const mongoose = require('mongoose')
const { getToken } = require('../helpers')

class UserController {
  static register ( req, res, next ) {
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      art: req.body.art
    })
    newUser.save()
      .then(result => {
        res.status(201).json(result)
      })
      .catch(next)
  }
  static async login ( req, res, next ) {
    try {
      const user = await User.findOne({
        email: req.body.email
      })
      if(user && user.password == req.body.password) {
        let dataUser = {
          _id: user._id,
          email: user.email
        }
        const access_token = getToken(dataUser)
        res.status(200).json({access_token: access_token})
      }
    } catch (error) {
      next(error)
    } 
  } 
}

module.exports = UserController