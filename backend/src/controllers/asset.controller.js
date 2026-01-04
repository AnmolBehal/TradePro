const Asset = require('../models/asset.model');
const axios = require('axios');

// Get all assets with optional type filter
exports.getAssets = async (req, res) => {
  try {
    const { type } = req.query;
    let query = {};
    
    if (type) {
      query.type = type;
    }
    
    const assets = await Asset.find(query).sort({ symbol: 1 });
    
    res.status(200).json(assets);
  } catch (error) {
    console.error('Get assets error:', error);
    res.status(500).json({
      message: 'Error fetching assets',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get asset by symbol
exports.getAssetBySymbol = async (req, res) => {
  try {
    const { symbol } = req.params;
    
    const asset = await Asset.findOne({ symbol: symbol.toUpperCase() });
    
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    
    res.status(200).json(asset);
  } catch (error) {
    console.error('Get asset by symbol error:', error);
    res.status(500).json({
      message: 'Error fetching asset',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get asset price history
exports.getAssetHistory = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { timeframe = '1d' } = req.query;
    
    // In a real application, you would fetch this from a market data API
    // For demo purposes, we'll generate some random data
    const now = new Date();
    const history = [];
    
    let dataPoints = 30; // Default for 1d
    let interval = 24 * 60 * 60 * 1000; // 1 day in milliseconds
    
    if (timeframe === '1h') {
      dataPoints = 60;
      interval = 60 * 60 * 1000; // 1 hour
    } else if (timeframe === '1w') {
      dataPoints = 7;
      interval = 7 * 24 * 60 * 60 * 1000; // 1 week
    } else if (timeframe === '1m') {
      dataPoints = 30;
      interval = 24 * 60 * 60 * 1000; // 1 day
    } else if (timeframe === '3m') {
      dataPoints = 90;
      interval = 24 * 60 * 60 * 1000; // 1 day
    } else if (timeframe === '1y') {
      dataPoints = 365;
      interval = 24 * 60 * 60 * 1000; // 1 day
    }
    
    // Find the asset to get current price
    const asset = await Asset.findOne({ symbol: symbol.toUpperCase() });
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    
    const basePrice = asset.currentPrice;
    
    // Generate price history
    for (let i = dataPoints - 1; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - (i * interval));
      const randomFactor = 0.98 + (Math.random() * 0.04); // Random factor between 0.98 and 1.02
      const price = basePrice * randomFactor * (1 - (i / dataPoints * 0.1)); // Slight trend
      
      history.push({
        price: parseFloat(price.toFixed(2)),
        timestamp
      });
    }
    
    res.status(200).json({
      symbol: symbol.toUpperCase(),
      timeframe,
      history
    });
  } catch (error) {
    console.error('Get asset history error:', error);
    res.status(500).json({
      message: 'Error fetching asset history',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Search assets
exports.searchAssets = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }
    
    const assets = await Asset.find({
      $or: [
        { symbol: { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } }
      ]
    }).limit(10);
    
    res.status(200).json(assets);
  } catch (error) {
    console.error('Search assets error:', error);
    res.status(500).json({
      message: 'Error searching assets',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update asset prices (would be called by a scheduled job in production)
// Add this function to update asset prices randomly
exports.updateAssetPrices = async () => {
  try {
    const assets = await Asset.find({});
    
    for (const asset of assets) {
      // Generate random percentage change between -5% and +5%
      const changePercent = (Math.random() * 10 - 5) / 100;
      
      // Calculate new price
      const oldPrice = asset.currentPrice;
      const newPrice = oldPrice * (1 + changePercent);
      
      // Update asset price
      asset.currentPrice = parseFloat(newPrice.toFixed(2));
      asset.priceChange24h = parseFloat((newPrice - oldPrice).toFixed(2));
      asset.priceChangePercent24h = parseFloat((changePercent * 100).toFixed(2));
      
      // Update market cap based on new price
      asset.marketCap = asset.currentPrice * asset.circulatingSupply;
      
      // Add to price history
      asset.priceHistory.push({
        price: asset.currentPrice,
        timestamp: new Date()
      });
      
      // Keep only the last 30 days of history
      if (asset.priceHistory.length > 30) {
        asset.priceHistory.shift();
      }
      
      await asset.save();
    }
    
    console.log(`Updated prices for ${assets.length} assets`);
  } catch (error) {
    console.error('Error updating asset prices:', error);
  }
};

// Seed initial assets (for development/demo purposes)
exports.seedAssets = async (req, res) => {
  try {
    // Check if assets already exist
    const count = await Asset.countDocuments();
    if (count > 0) {
      return res.status(400).json({ message: 'Assets already seeded' });
    }
    
    // Sample assets data
    const stocksData = [
      { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock', currentPrice: 150.25 },
      { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'stock', currentPrice: 290.10 },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'stock', currentPrice: 2750.80 },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'stock', currentPrice: 3300.45 },
      { symbol: 'TSLA', name: 'Tesla, Inc.', type: 'stock', currentPrice: 800.20 },
      { symbol: 'FB', name: 'Meta Platforms, Inc.', type: 'stock', currentPrice: 330.15 },
      { symbol: 'NFLX', name: 'Netflix, Inc.', type: 'stock', currentPrice: 550.60 },
      { symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'stock', currentPrice: 220.75 },
      { symbol: 'JPM', name: 'JPMorgan Chase & Co.', type: 'stock', currentPrice: 160.30 },
      { symbol: 'V', name: 'Visa Inc.', type: 'stock', currentPrice: 240.50 }
    ];
    
    const cryptoData = [
      { symbol: 'BTC', name: 'Bitcoin', type: 'crypto', currentPrice: 45000.00 },
      { symbol: 'ETH', name: 'Ethereum', type: 'crypto', currentPrice: 3200.00 },
      { symbol: 'BNB', name: 'Binance Coin', type: 'crypto', currentPrice: 420.00 },
      { symbol: 'ADA', name: 'Cardano', type: 'crypto', currentPrice: 2.10 },
      { symbol: 'SOL', name: 'Solana', type: 'crypto', currentPrice: 150.00 },
      { symbol: 'XRP', name: 'Ripple', type: 'crypto', currentPrice: 1.10 },
      { symbol: 'DOT', name: 'Polkadot', type: 'crypto', currentPrice: 30.50 },
      { symbol: 'DOGE', name: 'Dogecoin', type: 'crypto', currentPrice: 0.25 },
      { symbol: 'AVAX', name: 'Avalanche', type: 'crypto', currentPrice: 80.00 },
      { symbol: 'LINK', name: 'Chainlink', type: 'crypto', currentPrice: 25.00 }
    ];
    
    // Combine all assets
    const assetsData = [...stocksData, ...cryptoData];
    
    // Add additional fields and create assets
    const now = new Date();
    const assets = assetsData.map(asset => ({
      ...asset,
      dailyChange: 0,
      dailyChangePercentage: 0,
      marketCap: asset.currentPrice * (Math.random() * 1000000000 + 1000000000),
      volume24h: asset.currentPrice * (Math.random() * 10000000 + 1000000),
      high24h: asset.currentPrice * 1.02,
      low24h: asset.currentPrice * 0.98,
      priceHistory: [{ price: asset.currentPrice, timestamp: now }],
      lastUpdated: now
    }));
    
    // Insert assets into database
    await Asset.insertMany(assets);
    
    res.status(201).json({
      message: `Seeded ${assets.length} assets`,
      count: assets.length
    });
  } catch (error) {
    console.error('Seed assets error:', error);
    res.status(500).json({
      message: 'Error seeding assets',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};