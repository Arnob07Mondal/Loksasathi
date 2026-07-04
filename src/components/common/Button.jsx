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
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-[16px] transition-all duration-300 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2E8B57] disabled:opacity-50 disabled:pointer-events-none hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer';
  
  const variants = {
    primary: 'bg-gradient-to-r from-[#2E8B57] to-[#5FAF7B] hover:from-[#20613d] hover:to-[#49885e] text-white focus-visible:ring-[#2E8B57] shadow-md shadow-[#2E8B57]/10 hover:shadow-lg hover:shadow-[#2E8B57]/20 border border-[#2E8B57]/10',
    secondary: 'bg-white/55 hover:bg-white/75 border border-white/90 text-[#1F2937] focus-visible:ring-[#5FAF7B] backdrop-blur-md shadow-sm hover:shadow-md',
    outline: 'border border-slate-200/80 bg-white/45 hover:bg-white/80 hover:border-slate-300 text-slate-700 focus-visible:ring-[#2E8B57] shadow-sm hover:shadow-md',
    danger: 'bg-rose-500 hover:bg-rose-600 text-white focus-visible:ring-rose-500 shadow-md shadow-rose-500/10 hover:shadow-lg',
    ghost: 'bg-transparent hover:bg-slate-200/50 text-slate-600 hover:text-slate-900 focus-visible:ring-slate-300 shadow-none hover:shadow-none hover:-translate-y-0'
  };

  const sizes = {
    sm: 'text-[11px] px-3.5 py-1.5 gap-1.5 uppercase tracking-wide',
    md: 'text-xs px-5 py-2.5 gap-2 uppercase tracking-wide',
    lg: 'text-sm px-6 py-3.5 gap-2.5 uppercase tracking-wider'
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
