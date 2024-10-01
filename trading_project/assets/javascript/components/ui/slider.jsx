// assets/javascript/components/ui/slider.jsx

import React, { useState } from 'react';

const Slider = React.forwardRef(({ className = '', ...props }, ref) => {
  const [value, setValue] = useState(props.value || props.defaultValue || 0);

  const handleChange = (event) => {
    setValue(event.target.value);
    if (props.onValueChange) {
      props.onValueChange(event.target.value);
    }
  };

  return (
    <div className={`relative flex w-full touch-none select-none items-center ${className}`}>
      <input
        type="range"
        ref={ref}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        value={value}
        onChange={handleChange}
        {...props}
      />
      <div
        className="absolute h-2 bg-blue-500 rounded-lg"
        style={{ width: `${(value / props.max) * 100}%` }}
      ></div>
    </div>
  );
});

Slider.displayName = 'Slider';

export default Slider;