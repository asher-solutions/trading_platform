// assets/javascript/components/Navbar.jsx

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../../utils/api';
import { useTheme } from '../../contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

const Navbar = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const { darkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.getUserInfo();
        setIsAuthenticated(true);
        setUsername(response.username);
        // setUsername(response.data.username);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
        setUsername('');
      }
    };
    checkAuth();
}, []);

const handleLogout = async () => {
  try {
    await api.logout();
    setIsAuthenticated(false);
    setUsername('');
    // TODO: Redirect to login page OR home page
    // Redirect to login page or home page
    window.location.href = '/accounts/login/';
  } catch (error) {
    console.error('Error logging out:', error);
  }
}


  const navItems = [
    { name: 'Model Editor', href: '/' },
    { name: 'Backtesting', href: '/backtesting' },
    { name: 'Data Exploration', href: '/data-exploration' },
    { name: 'Model Leaderboards', href: '/leaderboards' },
    { name: 'Settings', href: '/settings' },
  ];

  return (
    // <nav className="bg-white dark:bg-gray-800 shadow-md">
    <nav className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {/* <Link href="/">
              <span className="flex-shrink-0">
                <img className="h-8 w-8" src="/logo.svg" alt="Logo" />
              </span>
            </Link> */}
            <span className="text-xl font-semibold text-gray-900 dark:text-white">
              Developer Mode
            </span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === item.href
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* href="/accounts/logout"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                <a>
                Logout
                </a> */}
            </div>
          </div>
        </div>
      </div>
      <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
        {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
      </button>
    </nav>
  );
};

export default Navbar;