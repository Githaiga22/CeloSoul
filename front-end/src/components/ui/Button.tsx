import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all touch-target disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variantClasses = {
      primary:
        'bg-primary-500 text-primary-950 hover:bg-primary-600 focus:ring-primary-500 shadow-sm',
      secondary:
        'bg-secondary-200 text-secondary-900 hover:bg-secondary-300 focus:ring-secondary-500',
      success:
        'bg-success-500 text-white hover:bg-success-600 focus:ring-success-500 shadow-sm',
      danger:
        'bg-danger-500 text-white hover:bg-danger-600 focus:ring-danger-500 shadow-sm',
      ghost: 'bg-transparent text-secondary-700 hover:bg-secondary-100 focus:ring-secondary-500',
    };

    const sizeClasses = {
      sm: 'text-sm px-3 py-2',
      md: 'text-base px-4 py-2.5',
      lg: 'text-lg px-6 py-3',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
