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
    saffron: 'glow-orange border-[#2E8B57]/20',
    green: 'glow-green border-emerald-500/20',
    blue: 'glow-blue border-[#5FAF7B]/20',
  };

  const borderGlow = glowEffect ? glowClasses[glowEffect] : '';

  return (
    <div
      id={id}
      className={`
        glass-panel 
        rounded-[24px] 
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
        <div className="px-6 py-4 border-b border-slate-200/40 bg-white/20 flex items-center justify-between">
          {header}
        </div>
      )}
      
      <div className="p-6">
        {children}
      </div>

      {footer && (
        <div className="px-6 py-4 border-t border-slate-200/40 bg-white/10">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
