import React from 'react';
import { cn } from '../utils';

const Input = React.forwardRef(({ 
  className, 
  type, 
  label, 
  error, 
  hint, 
  icon, 
  iconPosition = "left",
  ...props 
}, ref) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label 
          htmlFor={props.id} 
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      
      <div className={cn(
        "relative rounded-md shadow-sm",
        error && "ring-2 ring-red-500"
      )}>
        {icon && iconPosition === "left" && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            icon && iconPosition === "left" && "pl-10",
            icon && iconPosition === "right" && "pr-10",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        
        {icon && iconPosition === "right" && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
            {icon}
          </div>
        )}
      </div>
      
      {(error || hint) && (
        <p className={cn(
          "text-xs",
          error ? "text-red-600" : "text-gray-500"
        )}>
          {error || hint}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";
Input.defaultProps = {
  type: "text",
};

export { Input };
