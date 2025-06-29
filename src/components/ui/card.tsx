import { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  variant?: 'default' | 'bordered' | 'elevated';
}

const Card: React.FC<CardProps> = ({ 
  title, 
  subtitle, 
  actions, 
  children, 
  variant = 'default',
  className,
  ...props 
}) => {
  const variantClasses = {
    default: 'card',
    bordered: 'card border-2',
    elevated: 'card shadow-lg',
  };

  return (
    <div className={clsx(variantClasses[variant], className)} {...props}>
      {(title || subtitle || actions) && (
        <div className="border-b border-gray-200 pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
              )}
            </div>
            {actions && <div className="flex items-center space-x-2">{actions}</div>}
          </div>
        </div>
      )}
      
      <div>{children}</div>
    </div>
  );
};

export default Card; 