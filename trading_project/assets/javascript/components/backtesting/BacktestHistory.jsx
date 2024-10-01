// assets/javascript/components/backtesting/BacktestHistory.jsx

import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';

const BacktestHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await api.getBacktestHistory();
        setHistory(data);
      } catch (error) {
        console.error('Error fetching backtest history:', error);
      }
    };

    fetchHistory();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'beta': return 'bg-yellow-500';
      case 'alpha': return 'bg-blue-500';
      case 'production': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Backtest History</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="p-2 text-left">Model</th>
              <th className="p-2 text-left">Version</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Performance</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id} className="border-b dark:border-gray-600">
                <td className="p-2">{item.modelName}</td>
                <td className="p-2">{item.version}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 text-white rounded-full text-xs ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-2">{item.date}</td>
                <td className="p-2">{item.performance.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BacktestHistory;