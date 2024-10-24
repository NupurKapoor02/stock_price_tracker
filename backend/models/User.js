const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  watchlist: [{ type: String }], // Array of ticker symbols
  alerts: [{ ticker: String, threshold: Number }] // Array of alert settings
});

module.exports = mongoose.model('User', userSchema);
