// assets/javascript/pages/DataExploration.jsx

import React, { useState, useEffect } from 'react';
import { DataManagerApi } from '../api-client';

const DataExploration = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    symbol: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const dataManagerApi = new DataManagerApi();
      const response = await dataManagerApi.getMarketData(filters);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Data Exploration</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          name="symbol"
          value={filters.symbol}
          onChange={handleFilterChange}
          placeholder="Symbol"
          className="mr-2 p-2 border rounded"
        />
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="mr-2 p-2 border rounded"
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          className="mr-2 p-2 border rounded"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Apply Filters
        </button>
      </form>
      <table className="w-full">
        <thead>
          <tr>
            <th>Date</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Close</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.date}>
              <td>{item.date}</td>
              <td>{item.open}</td>
              <td>{item.high}</td>
              <td>{item.low}</td>
              <td>{item.close}</td>
              <td>{item.volume}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataExploration;