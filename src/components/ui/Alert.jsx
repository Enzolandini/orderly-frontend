import React from 'react';
import { cn } from '../utils';

const Alert = React.forwardRef(({ 
  className, 
  variant, 
  title, 
  children, 
  icon,
  dismissible,
  onDismiss,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative rounded-lg border p-4 mb-4",
        {
          "bg-blue-50 border-blue-200 text-blue-800": variant === "info",
          "bg-green-50 border-green-200 text-green-800": variant === "success",
          "bg-yellow-50 border-yellow-200 text-yellow-800": variant === "warning",
          "bg-red-50 border-red-200 text-red-800": variant === "error",
          "bg-gray-50 border-gray-200 text-gray-800": variant === "neutral",
        },
        className
      )}
      role="alert"
      {...props}
    >
      <div className="flex items-start">
        {icon && (
          <div className="flex-shrink-0 mr-3">
            {icon}
          </div>
        )}
        
        <div className="flex-1">
          {title && (
            <h3 className="text-sm font-medium mb-1">{title}</h3>
          )}
          <div className="text-sm opacity-90">
            {children}
          </div>
        </div>
        
        {dismissible && (
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8 focus:outline-none focus:ring-2 focus:ring-offset-2"
            onClick={onDismiss}
            aria-label="Fechar"
          >
            <span className="sr-only">Fechar</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
});

Alert.displayName = "Alert";
Alert.defaultProps = {
  variant: "info",
  dismissible: false
};

export { Alert };
