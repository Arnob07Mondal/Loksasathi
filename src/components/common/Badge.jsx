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
    neutral: 'bg-slate-800 text-slate-300 border border-slate-700/50',
    saffron: 'bg-brand-saffron/10 text-brand-saffron border border-brand-saffron/20',
    blue: 'bg-brand-blue/10 text-blue-400 border border-brand-blue/20',
    green: 'bg-brand-green/10 text-brand-green border border-brand-green/20',
    red: 'bg-red-500/10 text-red-400 border border-red-500/20',
    yellow: 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2'
  };

  const dotColors = {
    neutral: 'bg-slate-400',
    saffron: 'bg-brand-saffron',
    blue: 'bg-blue-400',
    green: 'bg-brand-green',
    red: 'bg-red-400',
    yellow: 'bg-amber-400'
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
