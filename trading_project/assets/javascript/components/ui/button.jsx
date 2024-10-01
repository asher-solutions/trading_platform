// assets/javascript/components/ui/button.jsx

import React from 'react';

const variantStyles = {
  default: 'bg-blue-500 text-white hover:bg-blue-600',
  destructive: 'bg-red-500 text-white hover:bg-red-600',
  outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  ghost: 'bg-transparent hover:bg-gray-100',
  link: 'bg-transparent text-blue-500 hover:underline',
};

const sizeStyles = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3',
  lg: 'h-11 rounded-md px-8',
  icon: 'h-10 w-10',
};

const Button = React.forwardRef(({
  className = '',
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}, ref) => {
  const Comp = asChild ? React.Fragment : 'button';
  return (
    <Comp
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = 'Button';

export default Button;