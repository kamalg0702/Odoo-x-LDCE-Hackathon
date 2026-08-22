import React from 'react';

export function ProgressBar({
  value = 0, // 0 to 100
  color = 'var(--traverse)',
  height = '8px',
  className = ''
}) {
  const percentage = Math.min(100, Math.max(0, value));

  return (
    <div
      style={{
        width: '100%',
        height,
        backgroundColor: 'var(--mist)',
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden'
      }}
      className={className}
    >
      <div
        style={{
          width: `${percentage}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: 'var(--radius-full)',
          transition: 'width 0.4s ease-out'
        }}
      />
    </div>
  );
}

export function Tabs({
  tabs = [], // [{ id, label, icon: Icon, badge }]
  activeTab,
  onChange,
  className = ''
}) {
  return (
    <div
      style={{
        display: 'inline-flex',
        backgroundColor: 'var(--sand)',
        padding: '4px',
        borderRadius: 'var(--radius-lg)',
        gap: '4px'
      }}
      className={className}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: isActive ? '600' : '500',
              borderRadius: 'var(--radius-md)',
              backgroundColor: isActive ? '#FFFFFF' : 'transparent',
              color: isActive ? 'var(--ink)' : 'var(--ink-muted)',
              boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            {Icon && <Icon size={15} />}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                style={{
                  fontSize: '11px',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isActive ? 'var(--traverse-light)' : 'var(--mist)',
                  color: isActive ? 'var(--traverse)' : 'var(--ink-muted)',
                  fontWeight: '600'
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
