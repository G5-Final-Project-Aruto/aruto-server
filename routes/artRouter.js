const { Router } = require("express");

const { ArtController } = require("../controllers");

const router = Router();

const { authorization, authentication } = require("../middlewares");

router.get("/", ArtController.getAllArt);
router.get("/:id", ArtController.getOneArt);

router.use(authorization);
router.post("/", ArtController.createArt);
router.patch("/:id/like", ArtController.addLikeArt);

router.put("/:id", authentication, ArtController.updateArt);
router.delete("/:id", authentication, ArtController.deleteArt);

module.exports = router;
