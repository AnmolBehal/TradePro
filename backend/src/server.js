const app = require('./app');
const http = require('http');
const mongoose = require('mongoose');
const { initializeSocket } = require('./socket');
const { seedAssets } = require('./seedData');
require('dotenv').config();

// Environment variables
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trading-platform';

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Seed assets if needed
    try {
      await seedAssets();
    } catch (err) {
      console.error('Error seeding assets:', err);
      // Continue starting the server even if seeding fails
    }
    
    // Start the server
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Add this import
const assetController = require('./controllers/asset.controller');

// Set up hourly price updates
setInterval(() => {
  assetController.updateAssetPrices();
}, 60 * 60 * 1000); // Run every hour

// Also update prices when the server starts
assetController.updateAssetPrices();