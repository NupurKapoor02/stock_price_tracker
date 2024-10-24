const express = require('express');
const { addToWatchlist, removeFromWatchlist, getWatchlistPrices } = require('../controllers/stockController');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.post('/watchlist/add', authenticateToken, addToWatchlist);
router.post('/watchlist/remove', authenticateToken, removeFromWatchlist);
router.get('/watchlist/prices', authenticateToken, getWatchlistPrices);

module.exports = router;
