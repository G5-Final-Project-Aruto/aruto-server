const { Category } = require('../models')

class Controller {
  static async getAllCategories(req, res, next) {
    try {
      const categories = await Category.find({})
      const dataCategories = categories.map(category => {
        return {
          _id: category._id,
          title: category.name
        }
      })
      res.status(200).json(dataCategories)
    } catch (error) {
      next(error)
    }
  }
  static async getCategory(req, res, next) {
    try {
      const category = await Category.findById({
        _id: req.params.id
      }).populate('arts')
      const dataArts = category.arts.map(art => {
        return {
          _id: art._id,
          user: art.user,
          title: art.title,
          image_url: art.image_url,
          price: art.price,
          likes: art.likes.length
        }
      })
      res.status(200).json({
        _id: category._id,
        title: category.name,
        arts: dataArts
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = Controller;
