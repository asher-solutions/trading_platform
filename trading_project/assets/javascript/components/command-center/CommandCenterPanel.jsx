// assets/javascript/components/command-center/CommandCenterPanel.jsx

import React, { useState, useEffect } from 'react';
// import { TradingViewWidget, widgetType } from 'react-tradingview-widget';

import { XIcon, SearchIcon } from '@heroicons/react/solid';
import Switch from '../ui/switch';
import { api } from '../../utils/api';

const TradingViewWidget = ({ symbol, widgetType, autosize, studies }) => (
    <div>Placeholder for TradingViewWidget: {symbol}</div>
  );

const CommandCenterPanel = ({ onClose }) => {
  const [ticker, setTicker] = useState('AAPL');
  const [quantity, setQuantity] = useState('auto');
  const [orderType, setOrderType] = useState('auto');
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [showAbout, setShowAbout] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await api.getOrderDetails(ticker);
        setOrderDetails(response.data);
        if (response.data.quantity) setQuantity(response.data.quantity);
        if (response.data.orderType) setOrderType(response.data.orderType);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();
  }, [ticker]);

  const handleTickerChange = (event) => {
    setTicker(event.target.value.toUpperCase());
  };

  const handleTrade = async (action) => {
    if (isAutoMode) return;
    try {
      await api.executeTrade({
        ticker,
        action,
        quantity,
        orderType
      });
      // Handle successful trade (e.g., show notification)
    } catch (error) {
      console.error('Error executing trade:', error);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <div className="w-1/2 h-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden relative">
      <div className="absolute top-2 left-2 z-10">
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <XIcon className="h-6 w-6" />
        </button>
      </div>
      <div className="absolute top-2 right-2 z-10 flex items-center">
        <span className="mr-2 text-sm">{isAutoMode ? 'Auto' : 'Manual'}</span>
        <Switch
          checked={isAutoMode}
          onChange={setIsAutoMode}
          className={`${isAutoMode ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span className={`${isAutoMode ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`} />
        </Switch>
      </div>
      <div className="flex h-full">
        <div className="w-1/3 p-4 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ticker</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                value={ticker}
                onChange={handleTickerChange}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter ticker"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              disabled={isAutoMode}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="auto">Auto: {orderDetails?.quantity || 'N/A'}</option>
              <option value="1">1</option>
              <option value="10">10</option>
              <option value="100">100</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Order Type</label>
            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              disabled={isAutoMode}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="auto">Auto: {orderDetails?.orderType || 'N/A'}</option>
              <option value="market">Market</option>
              <option value="limit">Limit</option>
              <option value="stop">Stop</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleTrade('buy')}
              disabled={isAutoMode}
              className={`flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${isAutoMode ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Buy
            </button>
            <button
              onClick={() => handleTrade('sell')}
              disabled={isAutoMode}
              className={`flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${isAutoMode ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Sell
            </button>
          </div>
          <button
            onClick={() => setShowAbout(!showAbout)}
            className="mt-4 w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {showAbout ? 'Hide' : 'Show'} About
          </button>
        </div>
        <div className="w-2/3 relative">
          {showAbout ? (
            <TradingViewWidget
              symbol={ticker}
              widgetType={widgetType.SYMBOL_INFO}
              autosize
            />
          ) : (
            <TradingViewWidget
              symbol={ticker}
              autosize
              studies={['RSI', 'MACD']}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandCenterPanel;