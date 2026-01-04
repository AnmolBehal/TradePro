const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller'); // Add this line
const authMiddleware = require('../middleware/auth.middleware');

// Apply auth middleware to all user routes
router.use(authMiddleware);

// Get user profile
router.get('/profile', userController.getUserProfile);

// Update user profile
router.put('/profile', userController.updateUserProfile);

// Add password change route
router.put('/password', authController.changePassword);

module.exports = router;