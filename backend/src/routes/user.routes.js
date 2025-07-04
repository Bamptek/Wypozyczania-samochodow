
const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// GET /api/users/me - Zwraca dane zalogowanego użytkownika
router.get('/me', [verifyToken], controller.getMe);

module.exports = router;