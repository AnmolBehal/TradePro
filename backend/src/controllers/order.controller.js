const Order = require('../models/order.model');
const User = require('../models/user.model');
const Asset = require('../models/asset.model');
const Portfolio = require('../models/portfolio.model');
const { io } = require('../socket');

// Place a new order
exports.placeOrder = async (req, res) => {
  try {
    const { symbol, type, side, quantity, price, stopPrice } = req.body;
    const userId = req.userId;

    // Validate order data
    if (!symbol || !type || !side || !quantity) {
      return res.status(400).json({ message: 'Missing required order fields' });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }

    if (type !== 'market' && !price) {
      return res.status(400).json({ message: 'Price is required for limit and stop orders' });
    }

    if (type === 'stop' && !stopPrice) {
      return res.status(400).json({ message: 'Stop price is required for stop orders' });
    }

    // Get the asset
    const asset = await Asset.findOne({ symbol: symbol.toUpperCase() });
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    // Get user's portfolio
    const portfolio = await Portfolio.findOne({ user: userId });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // For market orders, use current price
    const orderPrice = type === 'market' ? asset.currentPrice : price;
    const totalCost = orderPrice * quantity;

    // Check if user has enough balance for buy orders
    if (side === 'buy' && portfolio.cashBalance < totalCost) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    // For sell orders, check if user has enough assets
    if (side === 'sell') {
      const portfolioItem = portfolio.items.find(item => item.symbol === symbol.toUpperCase());
      if (!portfolioItem || portfolioItem.quantity < quantity) {
        return res.status(400).json({ message: 'Insufficient assets' });
      }
    }

    // Create the order
    const order = new Order({
      user: userId,
      symbol: symbol.toUpperCase(),
      type,
      side,
      quantity,
      price: orderPrice,
      stopPrice,
      status: 'pending',
      filledQuantity: 0,
      totalCost: 0
    });

    await order.save();

    // For market orders, execute immediately
    if (type === 'market') {
      await executeOrder(order._id);
    }

    // Notify user via WebSocket
    io.to(userId.toString()).emit('orderUpdate', { order });

    res.status(201).json({
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({
      message: 'Error placing order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const { status } = req.query;

    let query = { user: userId };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      message: 'Error fetching orders',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.userId;

    const order = await Order.findOne({ _id: orderId, user: userId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      message: 'Error fetching order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.userId;

    const order = await Order.findOne({ _id: orderId, user: userId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending orders can be cancelled' });
    }

    order.status = 'cancelled';
    await order.save();

    // Notify user via WebSocket
    io.to(userId.toString()).emit('orderUpdate', { order });

    res.status(200).json({
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      message: 'Error cancelling order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper function to execute an order (would be more complex in a real system)
async function executeOrder(orderId) {
  try {
    const order = await Order.findById(orderId);
    if (!order || order.status !== 'pending') {
      return;
    }

    const asset = await Asset.findOne({ symbol: order.symbol });
    if (!asset) {
      order.status = 'rejected';
      order.save();
      return;
    }

    const portfolio = await Portfolio.findOne({ user: order.user });
    if (!portfolio) {
      order.status = 'rejected';
      order.save();
      return;
    }

    // Execute the order
    const executionPrice = asset.currentPrice;
    const totalCost = executionPrice * order.quantity;

    if (order.side === 'buy') {
      // Check if user has enough balance
      if (portfolio.cashBalance < totalCost) {
        order.status = 'rejected';
        order.save();
        return;
      }

      // Update portfolio cash balance
      portfolio.cashBalance -= totalCost;

      // Update or add portfolio item
      const existingItemIndex = portfolio.items.findIndex(item => item.symbol === order.symbol);
      if (existingItemIndex >= 0) {
        const existingItem = portfolio.items[existingItemIndex];
        const newQuantity = existingItem.quantity + order.quantity;
        const newTotalCost = existingItem.averageBuyPrice * existingItem.quantity + totalCost;
        const newAverageBuyPrice = newTotalCost / newQuantity;

        portfolio.items[existingItemIndex].quantity = newQuantity;
        portfolio.items[existingItemIndex].averageBuyPrice = newAverageBuyPrice;
        portfolio.items[existingItemIndex].currentPrice = executionPrice;
        portfolio.items[existingItemIndex].totalValue = newQuantity * executionPrice;
      } else {
        portfolio.items.push({
          symbol: order.symbol,
          quantity: order.quantity,
          averageBuyPrice: executionPrice,
          currentPrice: executionPrice,
          totalValue: totalCost,
          lastUpdated: new Date()
        });
      }
    } else if (order.side === 'sell') {
      // Find the portfolio item
      const existingItemIndex = portfolio.items.findIndex(item => item.symbol === order.symbol);
      if (existingItemIndex < 0 || portfolio.items[existingItemIndex].quantity < order.quantity) {
        order.status = 'rejected';
        order.save();
        return;
      }

      // Update portfolio cash balance
      portfolio.cashBalance += totalCost;

      // Update portfolio item
      const existingItem = portfolio.items[existingItemIndex];
      const newQuantity = existingItem.quantity - order.quantity;

      if (newQuantity > 0) {
        portfolio.items[existingItemIndex].quantity = newQuantity;
        portfolio.items[existingItemIndex].totalValue = newQuantity * executionPrice;
      } else {
        // Remove the item if quantity is 0
        portfolio.items.splice(existingItemIndex, 1);
      }
    }

    // Update portfolio total value
    portfolio.totalValue = portfolio.items.reduce(
      (total, item) => total + item.totalValue,
      0
    ) + portfolio.cashBalance;

    // Update order status
    order.status = 'filled';
    order.filledQuantity = order.quantity;
    order.averageFilledPrice = executionPrice;
    order.totalCost = totalCost;

    // Save changes
    await order.save();
    await portfolio.save();

    // Notify user via WebSocket
    io.to(order.user.toString()).emit('orderUpdate', { order });
    io.to(order.user.toString()).emit('portfolioUpdate', { portfolio });
  } catch (error) {
    console.error('Execute order error:', error);
  }
}

// Export the execute order function for use in scheduled jobs
exports.executeOrder = executeOrder;