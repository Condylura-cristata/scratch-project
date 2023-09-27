const express = require('express');
const imageController = require('../controllers/imageController');
const router = express.Router();



router.get('/', imageController.getImages, (req, res) => res.status(200).json(res.locals.images))


router.post('/', imageController.addImage, (req, res) => res.status(200).json(res.locals.newImage))


module.exports = router;