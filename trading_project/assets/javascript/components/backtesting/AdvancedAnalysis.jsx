// assets/javascript/components/backtesting/AdvancedAnalysis.jsx

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdvancedAnalysis = ({ results }) => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-6">Advanced Analysis</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Risk Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={results.riskData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="var" name="Value at Risk" stroke="#8884d8" />
              <Line type="monotone" dataKey="maxDrawdown" name="Max Drawdown" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Liquidity Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={results.liquidityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="spread" name="Bid-Ask Spread" stroke="#8884d8" />
              <Line type="monotone" dataKey="volume" name="Trading Volume" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="p-2 text-left">Metric</th>
                <th className="p-2 text-left">Value</th>
                <th className="p-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {results.performanceMetrics.map((metric, index) => (
                <tr key={index} className="border-b dark:border-gray-600">
                  <td className="p-2">{metric.name}</td>
                  <td className="p-2">{metric.value}</td>
                  <td className="p-2">{metric.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Trade Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Price</th>
                <th className="p-2 text-left">Quantity</th>
                <th className="p-2 text-left">Profit/Loss</th>
              </tr>
            </thead>
            <tbody>
              {results.trades.map((trade, index) => (
                <tr key={index} className="border-b dark:border-gray-600">
                  <td className="p-2">{trade.date}</td>
                  <td className="p-2">{trade.type}</td>
                  <td className="p-2">{trade.price}</td>
                  <td className="p-2">{trade.quantity}</td>
                  <td className={`p-2 ${trade.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {trade.profitLoss}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalysis;