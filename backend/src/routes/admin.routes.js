const express = require('express');
const router = express.Router();
const controller = require('../controllers/admin.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// POST /api/admin/cars - Dodaje nowy samochód
router.post('/cars', [verifyToken, isAdmin], controller.addCar);

// GET /api/admin/cars - Pobiera wszystkie samochody dla panelu admina
router.get('/cars', [verifyToken, isAdmin], controller.getAllCarsForAdmin);

// PATCH /api/admin/cars/:id - Aktualizuje wszystkie dane samochodu
router.patch('/cars/:id', [verifyToken, isAdmin], controller.updateCar);

// PATCH /api/admin/cars/:id/status - Zmienia tylko status samochodu
router.patch('/cars/:id/status', [verifyToken, isAdmin], controller.updateCarStatus);

// DELETE /api/admin/cars/:id - Usuwa samochód
router.delete('/cars/:id', [verifyToken, isAdmin], controller.deleteCar);

// POST /api/admin/cars/service-log - Dodaje nowy wpis serwisowy
router.post('/cars/service-log', [verifyToken, isAdmin], controller.addServiceLog);


module.exports = router;