const express = require('express');
const router = express.Router();
// Update the controller import path
const assetController = require('../controllers/asset.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Apply auth middleware to all asset routes
router.use(authMiddleware);

// Get all assets
router.get('/', assetController.getAssets);

// Search assets
router.get('/search', assetController.searchAssets);

// Seed assets (for development)
router.post('/seed', assetController.seedAssets);

// Get asset by ID
router.get('/:id', assetController.getAssetBySymbol);

// Get asset price history
router.get('/:id/history', assetController.getAssetHistory);

module.exports = router;