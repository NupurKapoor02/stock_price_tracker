const axios = require('axios');
const User = require('../models/User');

// Fetch stock prices from Twelve Data API
const fetchStockPrice = async (ticker) => {
  const apiKey = process.env.TWELVE_DATA_API_KEY_1;
  const url = `https://api.twelvedata.com/price?symbol=${ticker}&apikey=${apiKey}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching stock price:", error.message);
    return null;
  }
};

// Add a company to the user's watchlist
exports.addToWatchlist = async (req, res) => {
  const { ticker } = req.body;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    user.watchlist.push(ticker);
    await user.save();
    res.json({ message: 'Company added to watchlist', watchlist: user.watchlist });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remove a company from the user's watchlist
exports.removeFromWatchlist = async (req, res) => {
  const { ticker } = req.body;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    user.watchlist = user.watchlist.filter(item => item !== ticker);
    await user.save();
    res.json({ message: 'Company removed from watchlist', watchlist: user.watchlist });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all stock prices for user's watchlist
exports.getWatchlistPrices = async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    const prices = await Promise.all(user.watchlist.map(ticker => fetchStockPrice(ticker)));
    res.json(prices);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// const User = require('../models/User'); // Adjust the path based on your structure
// const axios = require('axios');

// // Add stock to user's watchlist
// exports.addStockToWatchlist = async (req, res) => {
//   const { symbol } = req.body;
//   const userId = req.user.id; // Assuming you have user ID from authentication

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     if (!user.watchlist.includes(symbol)) {
//       user.watchlist.push(symbol);
//       await user.save();
//     }

//     res.json({ message: 'Stock added to watchlist', watchlist: user.watchlist });
//   } catch (error) {
//     console.error('Error adding stock:', error.message);
//     res.status(500).json({ message: 'Error adding stock to watchlist' });
//   }
// };

// // Remove stock from user's watchlist
// exports.removeStockFromWatchlist = async (req, res) => {
//   const { symbol } = req.body;
//   const userId = req.user.id; // Assuming you have user ID from authentication

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     user.watchlist = user.watchlist.filter(item => item !== symbol);
//     await user.save();

//     res.json({ message: 'Stock removed from watchlist', watchlist: user.watchlist });
//   } catch (error) {
//     console.error('Error removing stock:', error.message);
//     res.status(500).json({ message: 'Error removing stock from watchlist' });
//   }
// };

// // Fetch stock prices from Alpha Vantage API (already provided previously)
// exports.getStockPrices = async (req, res) => {
//   const apiKey = process.env.ALPHA_VANTAGE_API_KEY; // Load API key from .env
//   const { symbols } = req.body; // Example: ['AAPL', 'GOOG']

//   try {
//     // For each stock symbol, fetch the stock price using Alpha Vantage API
//     const stockPrices = await Promise.all(
//       symbols.map(async (symbol) => {
//         const response = await axios.get(
//           `https://www.alphavantage.co/query`, 
//           {
//             params: {
//               function: 'TIME_SERIES_INTRADAY',
//               symbol: symbol,
//               interval: '1min',  // 1min interval for real-time data
//               apikey: apiKey
//             }
//           }
//         );

//         const data = response.data;
//         if (data['Error Message']) {
//           return { symbol, price: 'N/A', error: 'Invalid stock symbol' };
//         }

//         // Extract the latest stock price from the 'Time Series (1min)' data
//         const timeSeries = data['Time Series (1min)'];
//         const latestTimestamp = Object.keys(timeSeries)[0];
//         const latestData = timeSeries[latestTimestamp];
//         const latestPrice = latestData['1. open'];

//         return { symbol, price: parseFloat(latestPrice) };
//       })
//     );

//     res.json(stockPrices); // Return an array of stock symbols with their prices
//   } catch (error) {
//     console.error('Error fetching stock prices:', error.message);
//     res.status(500).json({ message: 'Error fetching stock prices' });
//   }
// };