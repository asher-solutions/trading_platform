// assets/javascript/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import ModelEditor from './pages/ModelEditor';
import Backtesting from './pages/Backtesting';
import DataExploration from './pages/DataExploration';
import Leaderboards from './pages/Leaderboards';
import Settings from './pages/Settings';

const App = () => {
  return (
    <Router basename="/my-react-page/">
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Switch>
            <Route exact path="/" component={ModelEditor} />
            <Route path="/backtesting" component={Backtesting} />
            <Route path="/data-exploration" component={DataExploration} />
            <Route path="/leaderboards" component={Leaderboards} />
            <Route path="/settings" component={Settings} />
          </Switch>
        </main>
      </div>
    </Router>
  );
};

export default App;