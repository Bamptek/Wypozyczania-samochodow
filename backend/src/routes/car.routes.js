const express = require('express');
const router = express.Router();
const controller = require('../controllers/car.controller');
router.get('/', controller.getAllCars);
router.get('/:id', controller.getCarById);
module.exports = router;