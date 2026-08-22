import React from 'react';

export function Button({
  children,
  variant = 'primary', // primary, secondary, outline, ghost, danger, terrain
  size = 'md', // sm, md, lg
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: '600',
    borderRadius: 'var(--radius-md)',
    transition: 'all var(--transition-fast)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    border: '1px solid transparent',
    textDecoration: 'none'
  };

  const sizeStyles = {
    sm: { padding: '6px 12px', fontSize: '13px' },
    md: { padding: '9px 18px', fontSize: '14px' },
    lg: { padding: '12px 24px', fontSize: '16px' }
  };

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--traverse)',
      color: '#FFFFFF',
      boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
    },
    secondary: {
      backgroundColor: 'var(--sand)',
      color: 'var(--ink)',
      borderColor: 'var(--sand-dark)'
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--ink)',
      borderColor: 'var(--mist-dark)'
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--ink-muted)'
    },
    terrain: {
      backgroundColor: 'var(--terrain)',
      color: '#FFFFFF',
      boxShadow: '0 2px 6px rgba(5, 150, 105, 0.25)'
    },
    danger: {
      backgroundColor: 'var(--alert)',
      color: '#FFFFFF',
      boxShadow: '0 2px 6px rgba(220, 38, 38, 0.25)'
    }
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant]
      }}
      className={`gt-btn ${className}`}
      {...props}
    >
      {loading ? (
        <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid currentColor', borderRightColor: 'transparent', borderRadius: '50%', animation: 'pulseRipple 1s linear infinite' }} />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
        </>
      )}
    </button>
  );
}
