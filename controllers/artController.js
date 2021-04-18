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
      const arts = await Art.find().populate("user").populate('categories');
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
      }).populate("user").populate('categories');
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
      await Art.deleteOne({
        _id: req.params.id,
      });

      res.status(200).json({ message: "Art deleted succesfully" });
    } catch (error) {
      next(error);
    }
  }

  static async updateArt(req, res, next) {
    let image_url = "";
    try {
      const data = await uploadImage(req);
      image_url = data.image_url;

      await Art.updateOne(
        {
          _id: req.params.id,
        },
        {
          $set: {
            ...data,
            categories: data.categories.split(",").map((cat) => cat.trim()),
          },
        }
      );

      res.status(200).json({ message: "Art has been updated" });
    } catch (error) {
      if (image_url !== "") await deleteImage(image_url);
      next(error);
    }
  }

  static async addLikeArt(req, res, next) {
    try {
      await Art.updateOne(
        {
          _id: req.params.id,
        },
        {
          $push: {
            likes: req.currentUser._id,
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
