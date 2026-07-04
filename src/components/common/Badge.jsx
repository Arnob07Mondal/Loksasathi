import React from 'react';

const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  showDot = false,
  className = '',
  id,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full select-none';
  
  const variants = {
    neutral: 'bg-slate-100 text-slate-600 border border-slate-200',
    saffron: 'bg-[#2E8B57]/10 text-[#2E8B57] border border-[#2E8B57]/20',
    blue: 'bg-[#5FAF7B]/10 text-[#2E8B57] border border-[#5FAF7B]/20',
    green: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    red: 'bg-red-50 text-red-700 border border-red-200/60',
    yellow: 'bg-amber-50 text-amber-700 border border-amber-200/60'
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 gap-1 font-semibold uppercase tracking-wider',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold'
  };

  const dotColors = {
    neutral: 'bg-slate-400',
    saffron: 'bg-[#2E8B57]',
    blue: 'bg-[#5FAF7B]',
    green: 'bg-emerald-500',
    red: 'bg-red-500',
    yellow: 'bg-amber-500'
  };

  return (
    <span
      id={id}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} shrink-0 animate-pulse`} />
      )}
      {children}
    </span>
  );
};

export default Badge;
