// assets/javascript/components/ui/select.jsx

import React from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';

const Select = React.forwardRef(({ children, ...props }, ref) => (
  <select ref={ref} {...props}>
    {children}
  </select>
));

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props}>
    {children}
    <ChevronDown className="h-4 w-4 opacity-50" />
  </div>
));

const SelectValue = React.forwardRef(({ className, ...props }, ref) => (
  <span ref={ref} className={`block truncate ${className}`} {...props} />
));

const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={`relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 ${className}`} {...props}>
    <div className="max-h-[300px] overflow-auto">
      {children}
    </div>
  </div>
));

const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className}`} {...props}>
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <Check className="h-4 w-4" />
    </span>
    <span className="block truncate">{children}</span>
  </div>
));

Select.displayName = 'Select';
SelectTrigger.displayName = 'SelectTrigger';
SelectValue.displayName = 'SelectValue';
SelectContent.displayName = 'SelectContent';
SelectItem.displayName = 'SelectItem';

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };