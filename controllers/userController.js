const { User } = require("../models");
const { hashPassword, verifyPassword, getToken } = require("../helpers");

class Controller {
  static async register(req, res, next) {
    try {
      const { username, email, password, full_name } = req.body;
      const newUser = {
        username,
        email,
        full_name,
        password: hashPassword(password),
      };

      const user = await User.create(newUser);

      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
      });
    } catch (err) {
      next({
        code: 400,
        name: 'user is required'
      });
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user || !verifyPassword(password, user.password)) {
        throw { name: "Invalid email / password" };
      }

      const access_token = getToken({
        _id: user._id,
        email: user.email,
      });
      res.status(200).json({ 
        _id: user.id,
        email: user.email,
        access_token
       });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
