import React from 'react';

export function Badge({
  children,
  variant = 'blue', // blue, green, red, gold, gray
  size = 'md', // sm, md
  icon: Icon,
  className = '',
  style = {}
}) {
  const sizeStyles = {
    sm: { padding: '2px 6px', fontSize: '11px' },
    md: { padding: '3px 10px', fontSize: '12px' }
  };

  return (
    <span
      className={`badge badge-${variant} ${className}`}
      style={{
        ...sizeStyles[size],
        ...style
      }}
    >
      {Icon && <Icon size={size === 'sm' ? 10 : 12} />}
      {children}
    </span>
  );
}
