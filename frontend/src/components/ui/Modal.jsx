import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = '550px'
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(26, 26, 46, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          // FIXED: hardcoded white → var(--paper-card)
          backgroundColor: 'var(--paper-card)',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth,
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--mist)',
          overflow: 'hidden',
          animation: 'fadeIn 0.25s ease-out forwards'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--mist)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--ink)' }}>{title}</h3>
            {subtitle && <p style={{ fontSize: '13px', color: 'var(--ink-muted)', marginTop: '2px' }}>{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-md)',
              color: 'var(--ink-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--sand)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', maxHeight: 'calc(85vh - 120px)', overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
