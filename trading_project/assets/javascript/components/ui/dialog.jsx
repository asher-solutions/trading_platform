// assets/javascript/components/ui/dialog.jsx

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

export const Dialog = ({ children, open, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        {children}
      </div>
    </div>,
    document.body
  );
};

export const DialogContent = ({ children, ...props }) => (
  <div {...props}>{children}</div>
);

export const DialogHeader = ({ className = '', ...props }) => (
  <div className={`space-y-1.5 text-center sm:text-left ${className}`} {...props} />
);

export const DialogFooter = ({ className = '', ...props }) => (
  <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`} {...props} />
);

export const DialogTitle = ({ className = '', ...props }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props} />
);

export const DialogDescription = ({ className = '', ...props }) => (
  <p className={`text-sm text-gray-500 ${className}`} {...props} />
);