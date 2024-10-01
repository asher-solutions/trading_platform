// assets/javascript/components/ui/switch.jsx

import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

const Switch = React.forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    if (onCheckedChange) {
      onCheckedChange(newChecked);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      data-state={isChecked ? 'checked' : 'unchecked'}
      value={isChecked ? 'on' : 'off'}
      className={twMerge(
        'inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
        isChecked ? 'bg-primary' : 'bg-input',
        className
      )}
      onClick={handleToggle}
      ref={ref}
      {...props}
    >
      <span
        data-state={isChecked ? 'checked' : 'unchecked'}
        className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${
          isChecked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
});

Switch.displayName = 'Switch';

export default Switch;