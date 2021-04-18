const { Category } = require("../models");

class Controller {
  static async getAllCategories(req, res, next) {
    try {
      const categories = await Category.find({});
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
