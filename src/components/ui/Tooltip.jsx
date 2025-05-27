import React from 'react';
import { cn } from '../utils';

const Tooltip = ({ 
  children, 
  content, 
  position = "top", 
  className,
  delay = 300,
  ...props 
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [timeoutId, setTimeoutId] = React.useState(null);
  
  const showTooltip = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };
  
  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };
  
  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 translate-y-2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 -translate-x-2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 translate-x-2 ml-2",
  };
  
  const arrowClasses = {
    top: "bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full border-t-gray-800 border-l-transparent border-r-transparent",
    bottom: "top-0 left-1/2 transform -translate-x-1/2 -translate-y-full border-b-gray-800 border-l-transparent border-r-transparent",
    left: "right-0 top-1/2 transform translate-x-full -translate-y-1/2 border-l-gray-800 border-t-transparent border-b-transparent",
    right: "left-0 top-1/2 transform -translate-x-full -translate-y-1/2 border-r-gray-800 border-t-transparent border-b-transparent",
  };
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      {...props}
    >
      {children}
      
      {isVisible && (
        <div 
          className={cn(
            "absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-800 rounded-md shadow-sm max-w-xs",
            positionClasses[position],
            className
          )}
          role="tooltip"
        >
          {content}
          <div 
            className={cn(
              "absolute w-0 h-0 border-4",
              arrowClasses[position]
            )}
          />
        </div>
      )}
    </div>
  );
};

export { Tooltip };
