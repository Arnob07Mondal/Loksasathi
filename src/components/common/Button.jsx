import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  iconLeft: IconLeft,
  iconRight: IconRight,
  className = '',
  id,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer';
  
  const variants = {
    primary: 'bg-brand-saffron hover:bg-brand-saffron-dark text-slate-950 focus-visible:ring-brand-saffron shadow-lg shadow-brand-saffron/15 hover:shadow-brand-saffron/25',
    secondary: 'bg-brand-blue hover:bg-brand-blue-dark text-white focus-visible:ring-brand-blue shadow-lg shadow-brand-blue/15 hover:shadow-brand-blue/25',
    outline: 'border border-slate-700 bg-transparent hover:bg-slate-800/50 hover:border-slate-500 text-slate-200 focus-visible:ring-slate-500',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus-visible:ring-red-500 shadow-lg shadow-red-500/10 hover:shadow-red-500/20',
    ghost: 'bg-transparent hover:bg-slate-800/40 text-slate-300 hover:text-white focus-visible:ring-slate-700'
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5'
  };

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!isLoading && IconLeft && <IconLeft className="w-4 h-4 shrink-0" />}
      {children}
      {!isLoading && IconRight && <IconRight className="w-4 h-4 shrink-0" />}
    </button>
  );
};

export default Button;
