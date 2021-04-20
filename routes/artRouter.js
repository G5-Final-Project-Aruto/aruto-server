const { Router } = require("express");

const { ArtController } = require("../controllers");

const router = Router();

const { authorization } = require("../middlewares");

router.get("/", ArtController.getAllArt);
router.get("/:id", ArtController.getOneArt);

router.use(authorization);
router.post("/", ArtController.createArt);
router.patch("/:id/like", ArtController.likeArt);
router.put("/:id", ArtController.updateArt);
router.delete("/:id", ArtController.deleteArt);

module.exports = router;
