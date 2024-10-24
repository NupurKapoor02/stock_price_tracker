import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Watchlist from './Watchlist';

const Dashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStockPrices = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:5000/api/stocks/watchlist/prices', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStocks(response.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStockPrices();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Your Watchlist</h2>
      <Watchlist stocks={stocks} />
    </div>
  );
};

export default Dashboard;
