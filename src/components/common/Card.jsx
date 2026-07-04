import React from 'react';

const Card = ({
  children,
  header,
  footer,
  className = '',
  hoverEffect = false,
  glowEffect = '', // 'saffron', 'green', 'blue'
  id,
  ...props
}) => {
  const glowClasses = {
    saffron: 'glow-saffron border-brand-saffron/20',
    green: 'glow-green border-brand-green/20',
    blue: 'glow-blue border-brand-blue/30',
  };

  const borderGlow = glowEffect ? glowClasses[glowEffect] : '';

  return (
    <div
      id={id}
      className={`
        glass-panel 
        rounded-2xl 
        overflow-hidden 
        transition-all 
        duration-300 
        ${hoverEffect ? 'glass-panel-hover' : ''} 
        ${borderGlow}
        ${className}
      `}
      {...props}
    >
      {header && (
        <div className="px-6 py-4 border-b border-slate-800/40 bg-slate-900/20 flex items-center justify-between">
          {header}
        </div>
      )}
      
      <div className="p-6">
        {children}
      </div>

      {footer && (
        <div className="px-6 py-4 border-t border-slate-800/40 bg-slate-900/10">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
