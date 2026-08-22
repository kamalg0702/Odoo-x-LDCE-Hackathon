import React from 'react';
import { Compass, Plus, User, LogOut, Menu, ShieldCheck } from 'lucide-react';

export function Navbar({
  user,
  onNavigate,
  onLogout,
  onToggleSidebar,
  currentPath = ''
}) {
  return (
    <header className="glass-header" style={{ position: 'sticky', top: 0, zIndex: 100, height: '64px', display: 'flex', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Left: Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user && (
            <button
              onClick={onToggleSidebar}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', borderRadius: 'var(--radius-md)', color: 'var(--ink-muted)' }}
              aria-label="Toggle Navigation Sidebar"
            >
              <Menu size={20} />
            </button>
          )}
          <div
            onClick={() => onNavigate(user ? '/dashboard' : '/auth/login')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', boxShadow: 'var(--shadow-sm)' }}>
              <Compass size={22} className="route-dash-animated" style={{ color: 'var(--paper)' }} />
            </div>
            <div>
              <span className="font-display" style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px', color: 'var(--ink)' }}>
                GlobeTrotter
              </span>
              <span style={{ fontSize: '10px', display: 'block', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700', color: 'var(--traverse)', lineHeight: '1' }}>
                Multi-City Atlas
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions & User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {user ? (
            <>
              <button
                onClick={() => onNavigate('/trips/new')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--traverse)',
                  color: '#FFFFFF',
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  fontWeight: '600',
                  boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
                }}
              >
                <Plus size={16} />
                <span>New Trip</span>
              </button>

              {user.role === 'admin' && (
                <button
                  onClick={() => onNavigate('/admin')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'var(--sand)',
                    color: 'var(--ink)',
                    padding: '7px 12px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '13px',
                    fontWeight: '600',
                    border: '1px solid var(--sand-dark)'
                  }}
                  title="Admin Dashboard"
                >
                  <ShieldCheck size={16} style={{ color: 'var(--traverse)' }} />
                  <span>Admin</span>
                </button>
              )}

              {/* User Avatar & Profile */}
              <div
                onClick={() => onNavigate('/profile')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  border: '1px solid var(--mist)',
                  backgroundColor: '#FFFFFF',
                  transition: 'background var(--transition-fast)'
                }}
              >
                <img
                  src={user.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`}
                  alt={user.name}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ink)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name.split(' ')[0]}
                </span>
              </div>

              <button
                onClick={onLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--ink-muted)',
                  transition: 'color var(--transition-fast)'
                }}
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => onNavigate('/auth/login')}
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--ink)',
                  padding: '8px 16px'
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('/auth/register')}
                style={{
                  backgroundColor: 'var(--traverse)',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                Get Started
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
