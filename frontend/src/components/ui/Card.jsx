import React from 'react';

export function Card({
  children,
  className = '',
  interactive = false,
  padding = 'md', // none, sm, md, lg
  style = {},
  onClick,
  ...props
}) {
  const paddingMap = {
    none: '0',
    sm: '12px',
    md: '20px',
    lg: '28px'
  };

  return (
    <div
      onClick={onClick}
      style={{
        padding: paddingMap[padding],
        ...style
      }}
      className={`card-base ${interactive ? 'card-interactive' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
