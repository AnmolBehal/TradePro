const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symbol: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  type: {
    type: String,
    required: true,
    enum: ['market', 'limit', 'stop'],
    default: 'market'
  },
  side: {
    type: String,
    required: true,
    enum: ['buy', 'sell'],
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  price: {
    type: Number,
    required: function() {
      return this.type !== 'market';
    },
    min: 0
  },
  stopPrice: {
    type: Number,
    required: function() {
      return this.type === 'stop';
    },
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'filled', 'partially_filled', 'cancelled', 'rejected'],
    default: 'pending'
  },
  filledQuantity: {
    type: Number,
    default: 0,
    min: 0
  },
  averageFilledPrice: {
    type: Number,
    min: 0
  },
  totalCost: {
    type: Number,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;