// assets/javascript/components/layout/BaseLayout.jsx

import React from 'react';
import Navbar from './Navbar';

const BaseLayout = ({ children, hideNavbar = false }) => {
  return (
    <div className="flex flex-col h-screen">
      {!hideNavbar && <Navbar />}
      <main className={`flex-1 overflow-hidden ${hideNavbar ? 'h-screen' : ''}`}>{children}</main>
    </div>
  );
};

export default BaseLayout;