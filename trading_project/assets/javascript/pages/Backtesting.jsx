// assets/javascript/pages/Backtesting.jsx

import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import BaseLayout from '../components/layout/BaseLayout';
import BacktestHistory from '../components/backtesting/BacktestHistory';
import BacktestConfigForm from '../components/backtesting/BacktestConfigForm';
import BacktestResults from '../components/backtesting/BacktestResults';
import AdvancedAnalysis from '../components/backtesting/AdvancedAnalysis';

import  Button from '../components/ui/button';
import { toast } from 'react-hot-toast';

const Backtesting = () => {
  const [backtestResults, setBacktestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBacktestSubmit = async (config) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.runBacktest(config);
      setBacktestResults(response.data);
      toast.success('Backtest completed successfully');
    } catch (error) {
      console.error('Backtest error:', error);
      toast.error('Failed to run backtest. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBacktest = async () => {
    if (!backtestResults) return;
    try {
      const response = await api.saveBacktest(backtestResults);
      setBacktestResults(response.data);
      toast.success('Backtest saved successfully');
    } catch (error) {
      console.error('Save backtest error:', error);
      toast.error('Failed to save backtest. Please try again.');
    }
  };

  // pdf, csv, xlsx
  const handleExportBacktest = (format) => {
    if (!backtestResults) return;
    // Implement export logic here
    console.log(`Exporting backtest as ${format}`);
    toast.success(`Backtest exported as ${format}`);
  };

  return (
    <BaseLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Backtesting</h1>
        <BacktestHistory />
        <BacktestConfigForm onSubmit={handleBacktestSubmit} isLoading={isLoading} />
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {backtestResults && (
          <>
            <BacktestResults results={backtestResults} />
            <div className="mt-8 flex space-x-4">
              <Button onClick={handleSaveBacktest}>Save Backtest</Button>
              <Button onClick={() => handleExportBacktest('pdf')}>Export as PDF</Button>
              <Button onClick={() => handleExportBacktest('csv')}>Export as CSV</Button>
              <Button onClick={() => handleExportBacktest('xlsx')}>Export as XLSX</Button>
            </div>
            <AdvancedAnalysis results={backtestResults} />
          </>
        )}
      </div>
    </BaseLayout>
  );
};

export default Backtesting;
