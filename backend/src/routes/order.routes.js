const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Apply auth middleware to all order routes
router.use(authMiddleware);

// Get user orders
router.get('/', orderController.getUserOrders);

// Create new order
router.post('/', orderController.placeOrder);

// Get order by ID
router.get('/:id', orderController.getOrderById);

module.exports = router;