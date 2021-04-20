const { User } = require("../models");
const { verifyToken } = require("../helpers");

async function authorization(req, res, next) {
  try {
    if (!req.headers.access_token) {
      throw { name: "Please login first" };
    }

    const user = verifyToken(req.headers.access_token);

    if (!user._id || !user.email) {
      throw { name: "Invalid token" };
    }

    const dataUser = await User.findOne({
      _id: user._id,
    });

    if (!dataUser || dataUser.email !== user.email) {
      throw { name: "Invalid token" };
    }

    req.currentUser = dataUser;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  authorization,
};
