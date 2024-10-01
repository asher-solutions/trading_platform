// src/components/model-editor/ActionBar.tsx

import React from 'react';


const ActionBar= ({ onCompile, onSave, onBacktest }) => {
  return (
    <div className="bg-gray-200 dark:bg-gray-700 p-4 flex justify-center space-x-4">
      <button
        onClick={onCompile}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
      >
        Compile
      </button>
      <button
        onClick={onSave}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors"
      >
        Save Model
      </button>
      <button
        onClick={onBacktest}
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-colors"
      >
        Backtest Model
      </button>
    </div>
  );
};

export default ActionBar;