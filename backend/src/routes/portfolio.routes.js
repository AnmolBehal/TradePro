const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolio.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Apply auth middleware to all portfolio routes
router.use(authMiddleware);

// Get user portfolio
router.get('/', portfolioController.getUserPortfolio);

// Get portfolio history
router.get('/history', portfolioController.getPortfolioHistory);

// Get portfolio assets
router.get('/assets', portfolioController.getPortfolioAssets);

// Get portfolio stats
router.get('/stats', portfolioController.getPortfolioStats);

module.exports = router;