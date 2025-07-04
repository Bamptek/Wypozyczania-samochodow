const express = require('express');
const router = express.Router();
const controller = require('../controllers/booking.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// POST /api/bookings - Tworzy nową rezerwację
router.post('/', [verifyToken], controller.createBooking);

// GET /api/bookings/my-bookings - Pobiera historię rezerwacji zalogowanego usera
router.get('/my-bookings', [verifyToken], controller.getUserBookings);

// DELETE /api/bookings/:id - Anuluje rezerwację (przez zalogowanego usera)
router.delete('/:id', [verifyToken], controller.cancelBooking);

// GET /api/bookings/cancel/:id/:token - Publiczny link do anulowania z e-maila
router.get('/cancel/:id/:token', controller.cancelBookingFromEmail);

module.exports = router;