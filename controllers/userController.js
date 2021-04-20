const { User } = require("../models");
const { verifyPassword, getToken } = require("../helpers");

class Controller {
  static async register(req, res, next) {
    try {
      const { username, email, password, full_name } = req.body;

      const newUser = {
        username,
        email,
        full_name,
        password,
      };

      const user = await User.create(newUser);

      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user || !verifyPassword(password, user.password)) {
        throw { name: "Invalid email / password" };
      }

      const payload = {
        _id: user._id,
        email: user.email,
      };
      const access_token = getToken(payload);

      res.status(200).json({ ...payload, access_token });
    } catch (err) {
      next(err);
    }
  }

  static async getUser(req, res, next) {
    try {
      const user = await User.findById({
        _id: req.currentUser._id,
      }).populate("arts");

      delete user._doc.password;
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
