import React from 'react';
import { cn } from '../utils';

const Card = ({ className, variant, isHoverable, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden",
        {
          "card-hover": isHoverable,
          "border-blue-200 bg-blue-50": variant === "primary",
          "border-green-200 bg-green-50": variant === "success",
          "border-yellow-200 bg-yellow-50": variant === "warning",
          "border-red-200 bg-red-50": variant === "danger",
        },
        className
      )}
      {...props}
    />
  );
};

const CardHeader = ({ className, title, subtitle, icon, action, ...props }) => {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    >
      {(title || icon || action) && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon && <div className="text-blue-600">{icon}</div>}
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
};

const CardContent = ({ className, ...props }) => {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
};

const CardFooter = ({ className, ...props }) => {
  return (
    <div
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  );
};

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardContent.displayName = "CardContent";
CardFooter.displayName = "CardFooter";

Card.defaultProps = {
  variant: "default",
  isHoverable: false,
};

export { Card, CardHeader, CardContent, CardFooter };
