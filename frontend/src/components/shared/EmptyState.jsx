import React from 'react';
import { Compass, Plus } from 'lucide-react';
import { Button } from '../ui/Button';

export function EmptyState({
  title = 'No items found',
  description = 'Get started by creating your first entry.',
  actionLabel,
  onAction,
  icon: Icon = Compass
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        border: '1px dashed var(--mist-dark)',
        maxWidth: '500px',
        margin: '0 auto'
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--traverse-light)',
          color: 'var(--traverse)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}
      >
        <Icon size={28} />
      </div>

      <h3 className="font-display" style={{ fontSize: '18px', fontWeight: '700', color: 'var(--ink)' }}>
        {title}
      </h3>
      <p style={{ fontSize: '13px', color: 'var(--ink-muted)', marginTop: '6px', maxWidth: '360px', lineHeight: '1.5' }}>
        {description}
      </p>

      {actionLabel && onAction && (
        <div style={{ marginTop: '20px' }}>
          <Button variant="primary" icon={Plus} onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
