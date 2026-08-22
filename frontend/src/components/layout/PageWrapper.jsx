import React from 'react';

export function PageWrapper({
  children,
  maxWidth = '1300px',
  className = '',
  style = {}
}) {
  return (
    <main
      style={{
        flex: 1,
        maxWidth,
        width: '100%',
        margin: '0 auto',
        padding: '32px 24px',
        ...style
      }}
      className={`animate-fade-in ${className}`}
    >
      {children}
    </main>
  );
}

export function Toast({ toast, onDismiss }) {
  if (!toast) return null;

  const bgColors = {
    success: 'var(--terrain)',
    error: 'var(--alert)',
    info: 'var(--ink)'
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 10000,
        backgroundColor: bgColors[toast.type] || 'var(--ink)',
        color: '#FFFFFF',
        padding: '12px 20px',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xl)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '14px',
        fontWeight: '500',
        animation: 'fadeIn 0.25s ease-out'
      }}
      onClick={onDismiss}
    >
      <span>{toast.message}</span>
    </div>
  );
}
