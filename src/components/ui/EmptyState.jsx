import React from 'react';
import { cn } from '../utils';

const EmptyState = ({
  title,
  description,
  icon,
  action,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 rounded-lg border border-dashed border-gray-300 bg-gray-50",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
          {icon}
        </div>
      )}
      
      {title && (
        <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      )}
      
      {description && (
        <p className="text-sm text-gray-500 max-w-md mb-4">{description}</p>
      )}
      
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
};

export { EmptyState };
