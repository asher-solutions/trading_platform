// assets/javascript/components/BacktestConfigForm.jsx

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

const BacktestConfigForm = ({ onSubmit, isLoading }) => {
  const [config, setConfig] = useState({
    models: [],
    tickers: [],
    timeframes: [],
    interval: '1min',
    includePrePostMarket: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(config);
  };

  const handleChange = (name, value) => {
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="models">Models</Label>
          <Select
            onValueChange={(value) => handleChange('models', [value])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="model1">Model 1</SelectItem>
              <SelectItem value="model2">Model 2</SelectItem>
              <SelectItem value="model3">Model 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="tickers">Tickers</Label>
          <Input
            id="tickers"
            placeholder="AAPL, GOOGL, MSFT"
            onChange={(e) => handleChange('tickers', e.target.value.split(',').map(item => item.trim()))}
          />
        </div>
        <div>
          <Label htmlFor="timeframes">Timeframes</Label>
          <Select
            onValueChange={(value) => handleChange('timeframes', [value])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">1 Day</SelectItem>
              <SelectItem value="1h">1 Hour</SelectItem>
              <SelectItem value="15min">15 Minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="interval">Interval</Label>
          <Select
            onValueChange={(value) => handleChange('interval', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1min">1 Minute</SelectItem>
              <SelectItem value="5min">5 Minutes</SelectItem>
              <SelectItem value="15min">15 Minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-4 flex items-center space-x-2">
        <Checkbox
          id="includePrePostMarket"
          checked={config.includePrePostMarket}
          onCheckedChange={(checked) =>
            setConfig(prev => ({ ...prev, includePrePostMarket: checked as boolean }))
          }
        />
        <Label htmlFor="includePrePostMarket">
          Include Pre/Post Market Data
        </Label>
      </div>
      <Button type="submit" className="mt-6" disabled={isLoading}>
        {isLoading ? 'Running Backtest...' : 'Run Backtest'}
      </Button>
    </form>
  );
};

export default BacktestConfigForm;