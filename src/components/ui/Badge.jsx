import React from 'react';
import { cn } from '../utils';

const Badge = React.forwardRef(({ className, variant, size, children, icon, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
        {
          "bg-blue-100 text-blue-800 hover:bg-blue-200": variant === "primary",
          "bg-gray-100 text-gray-800 hover:bg-gray-200": variant === "secondary",
          "bg-green-100 text-green-800 hover:bg-green-200": variant === "success",
          "bg-yellow-100 text-yellow-800 hover:bg-yellow-200": variant === "warning",
          "bg-red-100 text-red-800 hover:bg-red-200": variant === "danger",
          "border border-current bg-transparent": variant === "outline",
          "px-2.5 py-0.5 text-xs": size === "sm",
          "px-3 py-1 text-sm": size === "md",
          "px-4 py-1.5 text-base": size === "lg",
        },
        className
      )}
      {...props}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </div>
  );
});

Badge.displayName = "Badge";
Badge.defaultProps = {
  variant: "primary",
  size: "sm"
};

export { Badge };
