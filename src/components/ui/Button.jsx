import React from 'react';
import { cn } from '../utils';

const Button = React.forwardRef(({ className, variant, size, icon, isLoading, children, ...props }, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative",
        {
          "bg-blue-600 text-white hover:bg-blue-700 shadow-sm": variant === "primary",
          "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm": variant === "outline",
          "bg-transparent text-gray-700 hover:bg-gray-100": variant === "ghost",
          "bg-gray-100 text-gray-900 hover:bg-gray-200": variant === "secondary",
          "bg-red-600 text-white hover:bg-red-700 shadow-sm": variant === "danger",
          "bg-green-600 text-white hover:bg-green-700 shadow-sm": variant === "success",
          "h-11 py-2 px-4 text-sm": size === "default",
          "h-9 px-3 rounded-md text-sm": size === "sm",
          "h-8 px-2 rounded-md text-xs": size === "xs",
          "h-12 px-6 rounded-md text-base": size === "lg",
        },
        className
      )}
      ref={ref}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processando...
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
});

Button.displayName = "Button";
Button.defaultProps = {
  variant: "primary",
  size: "default",
  isLoading: false,
};

export { Button };
