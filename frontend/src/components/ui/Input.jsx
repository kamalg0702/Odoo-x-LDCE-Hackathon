import React from 'react';

export function Input({
  label,
  error,
  icon: Icon,
  helperText,
  className = '',
  id,
  type = 'text',
  ...props
}) {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }} className={className}>
      {label && (
        <label
          htmlFor={inputId}
          style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ink)' }}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {Icon && (
          <div style={{ position: 'absolute', left: '12px', color: 'var(--ink-subtle)', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
            <Icon size={16} />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          style={{
            width: '100%',
            padding: Icon ? '10px 12px 10px 38px' : '10px 12px',
            fontSize: '14px',
            // FIXED: hardcoded white → var(--paper-card)
            backgroundColor: 'var(--paper-card)',
            border: `1px solid ${error ? 'var(--alert)' : 'var(--mist-dark)'}`,
            borderRadius: 'var(--radius-md)',
            color: 'var(--ink)',
            outline: 'none',
            transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)'
          }}
          onFocus={(e) => {
            if (!error) e.target.style.borderColor = 'var(--traverse)';
            e.target.style.boxShadow = `0 0 0 3px ${error ? 'rgba(220, 38, 38, 0.15)' : 'var(--traverse-ring)'}`;
          }}
          onBlur={(e) => {
            if (!error) e.target.style.borderColor = 'var(--mist-dark)';
            e.target.style.boxShadow = 'none';
          }}
          {...props}
        />
      </div>
      {error && <span style={{ fontSize: '12px', color: 'var(--alert)', fontWeight: '500' }}>{error}</span>}
      {helperText && !error && <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>{helperText}</span>}
    </div>
  );
}

export function Textarea({
  label,
  error,
  helperText,
  rows = 3,
  className = '',
  id,
  ...props
}) {
  const inputId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }} className={className}>
      {label && (
        <label
          htmlFor={inputId}
          style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ink)' }}
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        style={{
          width: '100%',
          padding: '10px 12px',
          fontSize: '14px',
          // FIXED: hardcoded white → var(--paper-card)
          backgroundColor: 'var(--paper-card)',
          border: `1px solid ${error ? 'var(--alert)' : 'var(--mist-dark)'}`,
          borderRadius: 'var(--radius-md)',
          color: 'var(--ink)',
          outline: 'none',
          resize: 'vertical',
          transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)'
        }}
        onFocus={(e) => {
          if (!error) e.target.style.borderColor = 'var(--traverse)';
          e.target.style.boxShadow = '0 0 0 3px var(--traverse-ring)';
        }}
        onBlur={(e) => {
          if (!error) e.target.style.borderColor = 'var(--mist-dark)';
          e.target.style.boxShadow = 'none';
        }}
        {...props}
      />
      {error && <span style={{ fontSize: '12px', color: 'var(--alert)', fontWeight: '500' }}>{error}</span>}
      {helperText && !error && <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>{helperText}</span>}
    </div>
  );
}

export function Select({
  label,
  options = [], // [{ value, label }]
  error,
  helperText,
  className = '',
  id,
  ...props
}) {
  const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }} className={className}>
      {label && (
        <label
          htmlFor={selectId}
          style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ink)' }}
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        style={{
          width: '100%',
          padding: '10px 12px',
          fontSize: '14px',
          // FIXED: hardcoded white → var(--paper-card)
          backgroundColor: 'var(--paper-card)',
          border: `1px solid ${error ? 'var(--alert)' : 'var(--mist-dark)'}`,
          borderRadius: 'var(--radius-md)',
          color: 'var(--ink)',
          outline: 'none',
          cursor: 'pointer'
        }}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span style={{ fontSize: '12px', color: 'var(--alert)', fontWeight: '500' }}>{error}</span>}
      {helperText && !error && <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>{helperText}</span>}
    </div>
  );
}
