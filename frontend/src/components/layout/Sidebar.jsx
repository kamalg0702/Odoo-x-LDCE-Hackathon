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
    { label: 'Profile & Settings', path: '/profile', icon: User },
  ];

  if (isAdmin) {
    navItems.push({ label: 'Admin Panel', path: '/admin', icon: ShieldCheck });
  }

  return (
    <aside
      style={{
        width: '240px',
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid var(--mist)',
        minHeight: 'calc(100vh - 64px)',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        flexShrink: 0
      }}
    >
      <div>
        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700', color: 'var(--ink-subtle)', marginBottom: '12px', paddingLeft: '12px' }}>
          Navigation
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '500',
                  color: isActive ? 'var(--traverse)' : 'var(--ink)',
                  backgroundColor: isActive ? 'var(--traverse-light)' : 'transparent',
                  textAlign: 'left',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Icon size={18} style={{ color: isActive ? 'var(--traverse)' : 'var(--ink-muted)' }} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div style={{ marginTop: 'auto', backgroundColor: 'var(--sand)', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--sand-dark)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--terrain)' }} />
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--ink)' }}>GlobeTrotter Engine</span>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--ink-muted)', lineHeight: '1.4' }}>
          Real-time route optimization, city cost indexing & smart budget tracking.
        </p>
      </div>
    </aside>
  );
}
