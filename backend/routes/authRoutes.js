const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getMe, seedAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/seed', seedAdmin); // Remove in production

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;
