// assets/javascript/pages/Developer.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Developer = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Developer Mode</h1>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link to="/developer-mode/model-editor" className="text-blue-500 hover:underline">
              Model Editor
            </Link>
          </li>
          <li>
            <Link to="/developer-mode/backtesting" className="text-blue-500 hover:underline">
              Backtesting
            </Link>
          </li>
          <li>
            <Link to="/developer-mode/data-exploration" className="text-blue-500 hover:underline">
              Data Exploration
            </Link>
          </li>
          <li>
            <Link to="/developer-mode/leaderboards" className="text-blue-500 hover:underline">
              Model Leaderboards
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Developer;