import React from 'react';
import { Compass, Plus, User, LogOut, Menu, ShieldCheck, Sliders } from 'lucide-react';
import { useUIStore, THEMES } from '../../core/store/ui.store';

export function Navbar({
  user,
  onNavigate,
  onLogout,
  onToggleSidebar,
  currentPath = ''
}) {
  const { theme, setTheme } = useUIStore();

  return (
    <header className="glass-header" style={{ position: 'sticky', top: 0, zIndex: 100, height: '54px', display: 'flex', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Left: Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user && (
            <button
              onClick={onToggleSidebar}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5px', borderRadius: 'var(--radius-md)', color: 'var(--ink-muted)' }}
              aria-label="Toggle Navigation Sidebar"
            >
              <Menu size={18} />
            </button>
          )}
          <div
            onClick={() => onNavigate(user ? '/dashboard' : '/')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <div style={{ width: '30px', height: '30px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', boxShadow: 'var(--shadow-sm)' }}>
              <Compass size={18} className="route-dash-animated" style={{ color: '#FFFFFF' }} />
            </div>
            <div>
              <span className="font-display" style={{ fontSize: '17px', fontWeight: '800', letterSpacing: '-0.5px', color: 'var(--ink)' }}>
                GlobeTrotter
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions, Theme Switcher & User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Dynamic Theme Picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              style={{
                padding: '4px 8px',
                borderRadius: 'var(--radius-md)',
                fontSize: '12px',
                fontWeight: '600',
                border: '1px solid var(--card-border)',
                backgroundColor: 'var(--paper-card)',
                color: 'var(--ink)',
                cursor: 'pointer'
              }}
              title="Change Theme"
            >
              {THEMES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.icon} {t.name}
                </option>
              ))}
            </select>
          </div>

          {user ? (
            <>
              <button
                onClick={() => onNavigate('/trips/new')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: 'var(--traverse)',
                  color: '#FFFFFF',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                <Plus size={14} />
                <span>New Trip</span>
              </button>

              {user.role === 'admin' && (
                <button
                  onClick={() => onNavigate('/admin')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: 'var(--sand)',
                    color: 'var(--ink)',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '12px',
                    fontWeight: '600',
                    border: '1px solid var(--sand-dark)'
                  }}
                  title="Admin Dashboard"
                >
                  <ShieldCheck size={14} style={{ color: 'var(--traverse)' }} />
                  <span>Admin</span>
                </button>
              )}

              {/* User Profile */}
              <div
                onClick={() => onNavigate('/profile')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  border: '1px solid var(--mist)',
                  backgroundColor: 'var(--paper-card)'
                }}
              >
                <img
                  src={user.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`}
                  alt={user.name}
                  style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--ink)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name.split(' ')[0]}
                </span>
              </div>

              <button
                onClick={onLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--ink-muted)'
                }}
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => onNavigate('/auth/login')}
                style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ink)', padding: '6px 10px' }}
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('/auth/register')}
                style={{
                  backgroundColor: 'var(--traverse)',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: '600',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                Start Free
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
