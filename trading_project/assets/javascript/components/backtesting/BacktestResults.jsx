// assets/javascript/components/BacktestResults.jsx

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import Slider from '../ui/slider';
import Button from '../ui/button';
import { PlayIcon, PauseIcon, RotateCwIcon } from 'lucide-react';

const BacktestResults = ({ results }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isLooping, setIsLooping] = useState(false);

  // Implement playback logic here

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Backtest Results</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Price Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Price Chart</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={results.priceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="price" stroke="#8884d8" />
              <Line type="monotone" dataKey="buySignal" stroke="#82ca9d" />
              <Line type="monotone" dataKey="sellSignal" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Volume Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Volume Chart</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={results.volumeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="volume" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Profit/Loss Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Profit/Loss Chart</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={results.profitLossData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="profitLoss" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Equity Line Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Equity Line Chart</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={results.equityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="equity" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Backtest Statistics */}
      <div className="mt-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Backtest Statistics</h3>
        <Table>
          <TableBody>
            {Object.entries(results.statistics).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell className="font-medium">{key}</TableCell>
                <TableCell>{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Playback Controls */}
      <div className="mt-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Playback Controls</h3>
        <div className="flex items-center space-x-4">
          <Button onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </Button>
          <Slider
            value={[currentIndex]}
            max={results.priceData.length - 1}
            step={1}
            onValueChange={([value]) => setCurrentIndex(value)}
          />
          <select
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
            className="p-2 border rounded"
          >
            <option value={0.25}>0.25x</option>
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
          <Button onClick={() => setIsLooping(!isLooping)}>
            <RotateCwIcon className={isLooping ? 'text-blue-500' : ''} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BacktestResults;