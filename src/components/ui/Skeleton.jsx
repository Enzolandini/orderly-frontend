import React from 'react';
import { cn } from '../utils';

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...props}
    />
  );
};

const SkeletonText = ({ lines = 1, className, ...props }) => {
  return (
    <div className="space-y-2" {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-4 w-full last:w-4/5", className)}
        />
      ))}
    </div>
  );
};

const SkeletonCard = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden p-6",
        className
      )}
      {...props}
    >
      <div className="space-y-4">
        <Skeleton className="h-8 w-2/3" />
        <SkeletonText lines={3} />
        <div className="flex items-center space-x-4 pt-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  );
};

export { Skeleton, SkeletonText, SkeletonCard };
