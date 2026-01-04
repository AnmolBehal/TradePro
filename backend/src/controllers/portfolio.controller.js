const Portfolio = require('../models/portfolio.model');
const Asset = require('../models/asset.model');
const Order = require('../models/order.model');

// Get user's portfolio
exports.getUserPortfolio = async (req, res) => {
  try {
    const userId = req.userId;

    let portfolio = await Portfolio.findOne({ user: userId });

    if (!portfolio) {
      // Create a new portfolio if one doesn't exist
      portfolio = new Portfolio({
        user: userId,
        items: [],
        totalValue: 0,
        cashBalance: 10000 // Starting balance
      });

      await portfolio.save();
    }

    // Update portfolio with current asset prices
    if (portfolio.items.length > 0) {
      let totalValue = portfolio.cashBalance;

      for (let i = 0; i < portfolio.items.length; i++) {
        const item = portfolio.items[i];
        const asset = await Asset.findOne({ symbol: item.symbol });

        if (asset) {
          // Update current price and total value
          portfolio.items[i].currentPrice = asset.currentPrice;
          portfolio.items[i].totalValue = item.quantity * asset.currentPrice;
          portfolio.items[i].profitLoss = (asset.currentPrice - item.averageBuyPrice) * item.quantity;
          portfolio.items[i].profitLossPercentage = ((asset.currentPrice / item.averageBuyPrice) - 1) * 100;
          portfolio.items[i].lastUpdated = new Date();

          totalValue += portfolio.items[i].totalValue;
        }
      }

      portfolio.totalValue = totalValue;
      portfolio.lastUpdated = new Date();

      await portfolio.save();
    }

    res.status(200).json(portfolio);
  } catch (error) {
    console.error('Get user portfolio error:', error);
    res.status(500).json({
      message: 'Error fetching portfolio',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get portfolio history
exports.getPortfolioHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const { timeframe = '1m' } = req.query;

    // In a real application, you would fetch this from a database
    // For demo purposes, we'll generate some random data
    const now = new Date();
    const history = [];

    let dataPoints = 30; // Default for 1m
    let interval = 24 * 60 * 60 * 1000; // 1 day in milliseconds

    if (timeframe === '1d') {
      dataPoints = 24;
      interval = 60 * 60 * 1000; // 1 hour
    } else if (timeframe === '1w') {
      dataPoints = 7;
      interval = 24 * 60 * 60 * 1000; // 1 day
    } else if (timeframe === '3m') {
      dataPoints = 90;
      interval = 24 * 60 * 60 * 1000; // 1 day
    } else if (timeframe === '1y') {
      dataPoints = 365;
      interval = 24 * 60 * 60 * 1000; // 1 day
    } else if (timeframe === 'all') {
      dataPoints = 730; // 2 years
      interval = 24 * 60 * 60 * 1000; // 1 day
    }

    // Get current portfolio value
    const portfolio = await Portfolio.findOne({ user: userId });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    const currentValue = portfolio.totalValue;
    let baseValue = currentValue * 0.7; // Start at 70% of current value

    // Generate portfolio history
    for (let i = dataPoints - 1; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - (i * interval));
      const randomFactor = 0.98 + (Math.random() * 0.04); // Random factor between 0.98 and 1.02
      const value = baseValue * randomFactor * (1 + (i / dataPoints * 0.3)); // Upward trend

      history.push({
        value: parseFloat(value.toFixed(2)),
        timestamp
      });
    }

    res.status(200).json({
      timeframe,
      history
    });
  } catch (error) {
    console.error('Get portfolio history error:', error);
    res.status(500).json({
      message: 'Error fetching portfolio history',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get portfolio statistics
exports.getPortfolioStats = async (req, res) => {
  try {
    const userId = req.userId;

    // Get portfolio
    const portfolio = await Portfolio.findOne({ user: userId });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Get orders
    const orders = await Order.find({ user: userId, status: 'filled' }).sort({ createdAt: -1 });

    // Calculate statistics
    const totalOrders = orders.length;
    const buyOrders = orders.filter(order => order.side === 'buy').length;
    const sellOrders = orders.filter(order => order.side === 'sell').length;

    // Calculate total profit/loss
    let totalInvested = 0;
    let totalReturned = 0;

    for (const order of orders) {
      if (order.side === 'buy') {
        totalInvested += order.totalCost;
      } else if (order.side === 'sell') {
        totalReturned += order.totalCost;
      }
    }

    // Calculate unrealized profit/loss
    let unrealizedProfitLoss = 0;
    for (const item of portfolio.items) {
      unrealizedProfitLoss += item.profitLoss || 0;
    }

    // Calculate realized profit/loss
    const realizedProfitLoss = totalReturned - totalInvested;

    // Calculate total profit/loss
    const totalProfitLoss = realizedProfitLoss + unrealizedProfitLoss;

    // Calculate profit/loss percentage
    const profitLossPercentage = totalInvested > 0 
      ? (totalProfitLoss / totalInvested) * 100 
      : 0;

    res.status(200).json({
      totalValue: portfolio.totalValue,
      cashBalance: portfolio.cashBalance,
      assetsValue: portfolio.totalValue - portfolio.cashBalance,
      totalOrders,
      buyOrders,
      sellOrders,
      totalInvested,
      totalReturned,
      realizedProfitLoss,
      unrealizedProfitLoss,
      totalProfitLoss,
      profitLossPercentage: parseFloat(profitLossPercentage.toFixed(2))
    });
  } catch (error) {
    console.error('Get portfolio stats error:', error);
    res.status(500).json({
      message: 'Error fetching portfolio statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get portfolio assets
exports.getPortfolioAssets = async (req, res) => {
  try {
    const userId = req.userId;

    // Get portfolio
    const portfolio = await Portfolio.findOne({ user: userId });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Return just the items array
    res.status(200).json(portfolio.items);
  } catch (error) {
    console.error('Get portfolio assets error:', error);
    res.status(500).json({
      message: 'Error fetching portfolio assets',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};