const { Art, User } = require("../models");
const { uploadImage, deleteImage } = require("../helpers");

class Controller {
  static async createArt(req, res, next) {
    let image_url = "",
      artId = "";
    try {
      const data = await uploadImage(req);
      image_url = data.image_url;

      const art = await Art.create({
        ...data,
        categories: data.categories.split(",").map((cat) => cat.trim()),
        user: req.currentUser._id,
      });
      artId = art._id;

      const user = await User.findOne({ _id: req.currentUser._id });
      user.arts.push(artId);
      await user.save();

      res.status(201).json(art);
    } catch (error) {
      if (artId !== "") await Art.deleteOne({ _id: artId });
      if (image_url !== "") await deleteImage(image_url);
      next(error);
    }
  }

  static async getAllArt(req, res, next) {
    try {
      const arts = await Art.find().populate("user");
      const dataArts = arts.map((art) => {
        return {
          _id: art._id,
          user: {
            _id: art.user._id,
            username: art.user.username,
          },
          title: art.title,
          image_url: art.image_url,
          price: art.price,
          likes: art.likes.length,
          categories: art.categories,
        };
      });
      res.status(200).json(dataArts);
    } catch (error) {
      next(error);
    }
  }

  static async getOneArt(req, res, next) {
    try {
      const art = await Art.findOne({
        _id: req.params.id,
      }).populate("user");
      res.status(200).json({
        _id: art._id,
        user: {
          _id: art.user._id,
          username: art.user.username,
        },
        title: art.title,
        image_url: art.image_url,
        price: art.price,
        likes: art.likes.length,
        categories: art.categories,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteArt(req, res, next) {
    try {
      const art = await Art.deleteOne({
        _id: req.params.id,
      });

      if (art.deletedCount === 0) {
        throw { name: "Art not found" };
      }

      res.status(200).json({ message: "Art deleted succesfully" });
    } catch (error) {
      next(error);
    }
  }

  static async updateArt(req, res, next) {
    try {
      const { title, image_url, price } = req.body;
      const dataArt = await Art.findOne({
        _id: req.params.id,
      });
      const art = await Art.updateOne(
        {
          _id: req.params.id,
        },
        {
          $set: {
            title,
            image_url,
            price,
          },
        }
      );
      res.status(200).json(dataArt);
    } catch (error) {
      next(error);
    }
  }

  static async addLikeArt(req, res, next) {
    try {
      const art = await Art.updateOne(
        {
          _id: req.params.id,
        },
        {
          $push: {
            likes: req.currentUser,
          },
        }
      );
      res.status(200).json({
        message: "Art has been liked",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
