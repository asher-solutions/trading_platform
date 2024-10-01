// assets/javascript/components/ShadcnNavbar.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from './ui/button';

const ShadcnNavbar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Model Editor', href: '/developer-mode/model-editor' },
    { name: 'Backtesting', href: '/developer-mode/backtesting' },
    { name: 'Data Exploration', href: '/developer-mode/data-exploration' },
    { name: 'Model Leaderboards', href: '/developer-mode/leaderboards' },
    { name: 'Settings', href: '/developer-mode/settings' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/">
              <span className="flex-shrink-0">
                <img className="h-8 w-8" src="/logo.svg" alt="Logo" />
              </span>
            </Link>
            <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
              Developer Mode
            </span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  variant={location.pathname === item.href ? 'default' : 'ghost'}
                  asChild
                >
                  <Link to={item.href}>{item.name}</Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ShadcnNavbar;