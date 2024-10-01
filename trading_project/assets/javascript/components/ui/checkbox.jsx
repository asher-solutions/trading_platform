// assets/javascript/components/ui/checkbox.jsx

import React, { useState } from 'react';

const Checkbox = React.forwardRef(({ className = '', ...props }, ref) => {
  const [checked, setChecked] = useState(props.checked || false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
    if (props.onCheckedChange) {
      props.onCheckedChange(event.target.checked);
    }
  };

  return (
    <div className="relative flex items-center">
      <input
        type="checkbox"
        ref={ref}
        className={`h-4 w-4 rounded border border-gray-300 text-blue-600 focus:ring-blue-500 ${className}`}
        checked={checked}
        onChange={handleChange}
        {...props}
      />
      {checked && (
        <svg
          className="absolute w-4 h-4 text-blue-600 pointer-events-none"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
        </svg>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
