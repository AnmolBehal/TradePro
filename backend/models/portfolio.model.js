const mongoose = require('mongoose');

const portfolioItemSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  averageBuyPrice: {
    type: Number,
    required: true,
    min: 0
  },
  currentPrice: {
    type: Number,
    min: 0
  },
  totalValue: {
    type: Number,
    min: 0
  },
  profitLoss: {
    type: Number
  },
  profitLossPercentage: {
    type: Number
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const portfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [portfolioItemSchema],
  totalValue: {
    type: Number,
    default: 0,
    min: 0
  },
  cashBalance: {
    type: Number,
    default: 10000, // Starting balance for demo purposes
    min: 0
  },
  totalProfitLoss: {
    type: Number,
    default: 0
  },
  totalProfitLossPercentage: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;