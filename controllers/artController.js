const { Art } = require("../models");
const { hashPassword, verifyPassword, getToken } = require("../helpers");
const { find } = require("../models/art");

class Controller {
  static async createArt( req, res, next ) {
    try {
      const { image_url, price } = req.body
      const newArt = {
        image_url,
        price
      }

      const art = await Art.create(newArt)
      res.status(201).json(art)
    } catch (error) {
      next(error)
    }
  }
  static async getAllArt( req, res, next ) {
    try {
      const arts = await Art.find({})
      res.status(200).json(arts)
    } catch (error) {
      next(error)
    }
  }
  static async getOneArt( req, res, next) {
    try {
      const art = await Art.findOne({
        _id: req.params.id
      })
      res.status(200).json(art)
    } catch (error) {
      next(error)
    }    
  }
  static async updateArt( req, res, next) {
    try {
      const { image_url, price } = req.body
      const art = await Art.updateOne({
        _id: req.params.id
      },{
        $set: {
          image_url,
          price
        }
      })
      console.log(image_url, price)
      res.status(200).json(art)
    } catch (error) {
      next(error)
    }    
  }
  static async deleteArt( req, res, next) {
    try {
      const art = await Art.deleteOne({
        _id: req.params.id
      })
      res.status(200).json({message: "success delete art"})
    } catch (error) {
      next(error)
    }
  }
}

module.exports = Controller;
