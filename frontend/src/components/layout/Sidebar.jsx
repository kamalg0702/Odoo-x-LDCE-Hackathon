import React from 'react';
import { LayoutDashboard, MapPin, Compass, User, ShieldCheck, PlusCircle } from 'lucide-react';

export function Sidebar({
  isOpen,
  currentPath,
  onNavigate,
  isAdmin = false
}) {
  if (!isOpen) return null;

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Trips', path: '/trips', icon: Compass },
    { label: 'Create Trip', path: '/trips/new', icon: PlusCircle },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  if (isAdmin) {
    navItems.push({ label: 'Admin', path: '/admin', icon: ShieldCheck });
  }

  return (
    <aside
      style={{
        width: '195px',
        backgroundColor: 'var(--paper-card)',
        borderRight: '1px solid var(--card-border)',
        minHeight: 'calc(100vh - 54px)',
        padding: '16px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        flexShrink: 0
      }}
    >
      <div>
        <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '700', color: 'var(--ink-subtle)', marginBottom: '8px', paddingLeft: '8px' }}>
          Menu
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path || (item.path !== '/dashboard' && currentPath.startsWith(item.path) && item.path !== '/trips/new');
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? 'var(--traverse)' : 'var(--ink)',
                  backgroundColor: isActive ? 'var(--traverse-light)' : 'transparent',
                  textAlign: 'left',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Icon size={16} style={{ color: isActive ? 'var(--traverse)' : 'var(--ink-muted)' }} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div style={{ marginTop: 'auto', backgroundColor: 'var(--sand)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--sand-dark)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--terrain)' }} />
          <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--ink)' }}>GlobeTrotter v2.0</span>
        </div>
        <p style={{ fontSize: '10px', color: 'var(--ink-muted)', lineHeight: '1.3' }}>
          Real-time INR budget calculations & route engine.
        </p>
      </div>
    </aside>
  );
}
