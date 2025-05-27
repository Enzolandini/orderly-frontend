import React from 'react';
import { cn } from '../utils';

const Textarea = React.forwardRef(({ 
  className, 
  label, 
  error, 
  hint, 
  counter, 
  maxLength,
  ...props 
}, ref) => {
  const [charCount, setCharCount] = React.useState(props.value?.length || 0);
  
  const handleChange = (e) => {
    setCharCount(e.target.value.length);
    if (props.onChange) {
      props.onChange(e);
    }
  };
  
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
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          ref={ref}
          maxLength={maxLength}
          onChange={counter ? handleChange : props.onChange}
          {...props}
        />
      </div>
      
      <div className="flex justify-between items-center">
        {(error || hint) && (
          <p className={cn(
            "text-xs",
            error ? "text-red-600" : "text-gray-500"
          )}>
            {error || hint}
          </p>
        )}
        
        {counter && maxLength && (
          <p className={cn(
            "text-xs text-gray-500 ml-auto",
            charCount > maxLength * 0.9 && "text-yellow-600",
            charCount >= maxLength && "text-red-600"
          )}>
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
