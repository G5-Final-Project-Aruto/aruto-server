const { Router } = require("express");

const { ArtController } = require("../controllers");

const router = Router();

const { authentic } = require('../middlewares')

router.get('/', ArtController.getAllArt)
router.get('/:id', ArtController.getOneArt)
router.use(authentic)
router.post('/', ArtController.createArt)
router.put('/:id', ArtController.updateArt)
router.delete('/:id', ArtController.deleteArt)

module.exports = router;
