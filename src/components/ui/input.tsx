import { forwardRef, InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | undefined;
  helpText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="h-5 w-5 text-gray-400">{leftIcon}</div>
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'form-input',
              {
                'pl-10': leftIcon,
                'pr-10': rightIcon,
                'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500': error,
              },
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${inputId}-error` : helpText ? `${inputId}-description` : undefined
            }
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <div className="h-5 w-5 text-gray-400">{rightIcon}</div>
            </div>
          )}
        </div>
        
        {error && (
          <p className="form-error" id={`${inputId}-error`}>
            {error}
          </p>
        )}
        
        {helpText && !error && (
          <p className="mt-1 text-sm text-gray-500" id={`${inputId}-description`}>
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 