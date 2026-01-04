const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['stock', 'crypto', 'forex', 'commodity'],
    default: 'stock'
  },
  currentPrice: {
    type: Number,
    required: true
  },
  dailyChange: {
    type: Number,
    default: 0
  },
  dailyChangePercentage: {
    type: Number,
    default: 0
  },
  marketCap: {
    type: Number
  },
  volume24h: {
    type: Number
  },
  high24h: {
    type: Number
  },
  low24h: {
    type: Number
  },
  priceHistory: [{
    price: Number,
    timestamp: Date
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Asset = mongoose.model('Asset', assetSchema);

module.exports = Asset;