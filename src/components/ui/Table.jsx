import React from 'react';
import { cn } from '../utils';

const Table = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div className="w-full overflow-auto">
      <table
        ref={ref}
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
});

const TableHeader = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
  );
});

const TableBody = React.forwardRef(({ className, ...props }, ref) => {
  return <tbody ref={ref} className={cn("", className)} {...props} />;
});

const TableFooter = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <tfoot
      ref={ref}
      className={cn("bg-gray-50 font-medium", className)}
      {...props}
    />
  );
});

const TableRow = React.forwardRef(({ className, isClickable, isSelected, ...props }, ref) => {
  return (
    <tr
      ref={ref}
      className={cn(
        "border-b transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-50",
        isClickable && "cursor-pointer",
        isSelected && "bg-gray-50",
        className
      )}
      {...props}
    />
  );
});

const TableHead = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <th
      ref={ref}
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  );
});

const TableCell = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <td
      ref={ref}
      className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
      {...props}
    />
  );
});

const TableCaption = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <caption
      ref={ref}
      className={cn("mt-4 text-sm text-gray-500", className)}
      {...props}
    />
  );
});

Table.displayName = "Table";
TableHeader.displayName = "TableHeader";
TableBody.displayName = "TableBody";
TableFooter.displayName = "TableFooter";
TableRow.displayName = "TableRow";
TableHead.displayName = "TableHead";
TableCell.displayName = "TableCell";
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
};
