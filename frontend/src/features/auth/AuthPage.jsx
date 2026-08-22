import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Compass, Mail, Lock, User, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../core/hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isRegisterInitial = location.pathname.includes('register');
  const [isRegister, setIsRegister] = useState(isRegisterInitial);

  const { login, register, isLoading, error } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister) {
      await register(formData.name, formData.email, formData.password);
    } else {
      await login(formData.email, formData.password);
    }
  };

  const handleFillDemo = (role = 'traveler') => {
    if (role === 'admin') {
      setFormData({
        name: 'Admin Commander',
        email: 'admin@globetrotter.io',
        password: 'AdminPass123!'
      });
      setIsRegister(false);
    } else {
      setFormData({
        name: 'Sophia Vance',
        email: 'traveler@globetrotter.io',
        password: 'Traveler123!'
      });
      setIsRegister(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        backgroundColor: 'var(--paper)'
      }}
      className="atlas-bg-pattern"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          padding: '36px 32px',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--mist)',
          animation: 'fadeIn 0.3s ease-out'
        }}
      >
        {/* Brand Icon & Heading */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--ink)',
              color: '#FFFFFF',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <Compass size={28} className="route-dash-animated" style={{ color: 'var(--paper)' }} />
          </div>
          <h2 className="font-display" style={{ fontSize: '26px', fontWeight: '800', color: 'var(--ink)', letterSpacing: '-0.5px' }}>
            {isRegister ? 'Begin Your Journey' : 'Welcome to GlobeTrotter'}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)', marginTop: '4px' }}>
            {isRegister
              ? 'Create an account to craft multi-city itineraries.'
              : 'Sign in to access your personal travel atlas.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--sand)',
            padding: '4px',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '24px'
          }}
        >
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            style={{
              flex: 1,
              padding: '8px',
              fontSize: '13px',
              fontWeight: !isRegister ? '700' : '500',
              borderRadius: 'var(--radius-md)',
              backgroundColor: !isRegister ? '#FFFFFF' : 'transparent',
              color: !isRegister ? 'var(--ink)' : 'var(--ink-muted)',
              boxShadow: !isRegister ? 'var(--shadow-sm)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            style={{
              flex: 1,
              padding: '8px',
              fontSize: '13px',
              fontWeight: isRegister ? '700' : '500',
              borderRadius: 'var(--radius-md)',
              backgroundColor: isRegister ? '#FFFFFF' : 'transparent',
              color: isRegister ? 'var(--ink)' : 'var(--ink-muted)',
              boxShadow: isRegister ? 'var(--shadow-sm)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isRegister && (
            <Input
              label="Full Name"
              icon={User}
              placeholder="e.g. Sophia Vance"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          )}

          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder="you@example.com"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <Input
            label="Password"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isLoading}
            icon={ArrowRight}
            iconPosition="right"
            style={{ marginTop: '8px', width: '100%' }}
          >
            {isRegister ? 'Create Account' : 'Sign In to GlobeTrotter'}
          </Button>
        </form>

        {/* Quick Demo Fill Buttons */}
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--mist)' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '700', color: 'var(--ink-subtle)', textAlign: 'center', marginBottom: '10px' }}>
            Quick Demo Fill
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleFillDemo('traveler')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '7px 10px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: 'var(--traverse-light)',
                color: 'var(--traverse)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(37, 99, 235, 0.2)'
              }}
            >
              <Sparkles size={13} />
              <span>Demo Traveler</span>
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('admin')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '7px 10px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: 'var(--sand)',
                color: 'var(--ink)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--sand-dark)'
              }}
            >
              <CheckCircle2 size={13} style={{ color: 'var(--terrain)' }} />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
