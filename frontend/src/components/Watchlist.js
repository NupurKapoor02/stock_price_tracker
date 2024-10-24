import React, { useState } from 'react';
import axios from 'axios';

const Watchlist = ({ stocks }) => {
  const [ticker, setTicker] = useState('');

  const addToWatchlist = async () => {
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:5000/api/stocks/watchlist/add', { ticker }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTicker('');
  };

  return (
    <div>
      <h3>Stock Prices</h3>
      <ul>
        {stocks.map((stock, index) => (
          <li key={index}>{stock.symbol}: {stock.price}</li>
        ))}
      </ul>
      <input type="text" value={ticker} onChange={(e) => setTicker(e.target.value)} placeholder="Add Ticker" />
      <button onClick={addToWatchlist}>Add</button>
    </div>
  );
};

export default Watchlist;
