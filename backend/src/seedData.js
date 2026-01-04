// Replace the entire file with this code
const Asset = require('./models/asset.model');

async function seedAssets() {
  try {
    // Check if assets already exist
    const count = await Asset.countDocuments();
    if (count > 0) {
      console.log('Assets already seeded');
      return;
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
    
    console.log(`Seeded ${assets.length} assets`);
  } catch (error) {
    console.error('Seed assets error:', error);
  }
}

module.exports = { seedAssets };