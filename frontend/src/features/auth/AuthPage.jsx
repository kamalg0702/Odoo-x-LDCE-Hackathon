import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Compass, Mail, Lock, User, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../core/hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isRegisterInitial = location.pathname.includes('register');
  const [isRegister, setIsRegister] = useState(isRegisterInitial);

  const { login, register, loginWithGoogle, isLoading, error } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister) {
      await register(formData.name, formData.email, formData.password);
    } else {
      await login(formData.email, formData.password);
    }
  };

  const handleGoogleSubmit = async (e) => {
    e.preventDefault();
    if (!googleEmail) return;
    await loginWithGoogle(
      googleEmail,
      googleName || googleEmail.split('@')[0],
      `https://api.dicebear.com/7.x/bottts/svg?seed=${googleEmail}`
    );
    setIsGoogleModalOpen(false);
  };

  const handleQuickGoogle = async (email, name) => {
    await loginWithGoogle(email, name, `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`);
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
          maxWidth: '430px',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          padding: '32px 28px',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--card-border)',
          animation: 'fadeIn 0.25s ease-out'
        }}
      >
        {/* Brand Icon & Heading */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div
            onClick={() => navigate('/')}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--ink)',
              color: '#FFFFFF',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '10px',
              boxShadow: 'var(--shadow-md)',
              cursor: 'pointer'
            }}
          >
            <Compass size={24} className="route-dash-animated" style={{ color: '#FFFFFF' }} />
          </div>
          <h2 className="font-display" style={{ fontSize: '24px', fontWeight: '800', color: 'var(--ink)', letterSpacing: '-0.5px' }}>
            {isRegister ? 'Begin Your Journey' : 'Welcome to GlobeTrotter'}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)', marginTop: '2px' }}>
            {isRegister
              ? 'Create your account to design multi-city itineraries.'
              : 'Sign in to access your personal travel atlas.'}
          </p>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={() => setIsGoogleModalOpen(true)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '10px 16px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--mist-dark)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--ink)',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all var(--transition-fast)',
            marginBottom: '16px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--sand)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
        >
          {/* Official Google 'G' SVG Logo */}
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '14px 0' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--mist)' }} />
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--ink-subtle)', fontWeight: '700' }}>
            or with email
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--mist)' }} />
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--sand)',
            padding: '3px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '18px'
          }}
        >
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            style={{
              flex: 1,
              padding: '7px',
              fontSize: '13px',
              fontWeight: !isRegister ? '700' : '500',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: !isRegister ? '#FFFFFF' : 'transparent',
              color: !isRegister ? 'var(--ink)' : 'var(--ink-muted)',
              boxShadow: !isRegister ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            style={{
              flex: 1,
              padding: '7px',
              fontSize: '13px',
              fontWeight: isRegister ? '700' : '500',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: isRegister ? '#FFFFFF' : 'transparent',
              color: isRegister ? 'var(--ink)' : 'var(--ink-muted)',
              boxShadow: isRegister ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
            size="md"
            loading={isLoading}
            icon={ArrowRight}
            iconPosition="right"
            style={{ marginTop: '6px', width: '100%' }}
          >
            {isRegister ? 'Create Account' : 'Sign In to GlobeTrotter'}
          </Button>
        </form>

        {/* Quick Demo Fill Buttons */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--mist)' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '700', color: 'var(--ink-subtle)', textAlign: 'center', marginBottom: '8px' }}>
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
                padding: '6px 8px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: 'var(--traverse-light)',
                color: 'var(--traverse)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--traverse-ring)'
              }}
            >
              <Sparkles size={12} />
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
                padding: '6px 8px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: 'var(--sand)',
                color: 'var(--ink)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--sand-dark)'
              }}
            >
              <CheckCircle2 size={12} style={{ color: 'var(--terrain)' }} />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

      </div>

      {/* Google Sign-in Modal */}
      <Modal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        title="Sign in with Google"
        subtitle="Choose a Google account or enter your Google email"
        maxWidth="400px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Quick One-Click Google Accounts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              onClick={() => handleQuickGoogle('alex.traveler@gmail.com', 'Alex Rivera')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--mist)',
                backgroundColor: 'var(--paper)',
                cursor: 'pointer',
                transition: 'border-color var(--transition-fast)'
              }}
            >
              <img
                src="https://api.dicebear.com/7.x/bottts/svg?seed=alex.traveler@gmail.com"
                alt="Alex"
                style={{ width: '32px', height: '32px', borderRadius: '50%' }}
              />
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--ink)' }}>Alex Rivera</div>
                <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>alex.traveler@gmail.com</div>
              </div>
            </div>

            <div
              onClick={() => handleQuickGoogle('priya.patel@gmail.com', 'Priya Patel')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--mist)',
                backgroundColor: 'var(--paper)',
                cursor: 'pointer'
              }}
            >
              <img
                src="https://api.dicebear.com/7.x/bottts/svg?seed=priya.patel@gmail.com"
                alt="Priya"
                style={{ width: '32px', height: '32px', borderRadius: '50%' }}
              />
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--ink)' }}>Priya Patel</div>
                <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>priya.patel@gmail.com</div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ink-subtle)', margin: '4px 0' }}>
            or use another Google account
          </div>

          <form onSubmit={handleGoogleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Input
              label="Google Email"
              type="email"
              placeholder="user@gmail.com"
              required
              value={googleEmail}
              onChange={(e) => setGoogleEmail(e.target.value)}
            />
            <Input
              label="Your Name (Optional)"
              placeholder="e.g. Rohan Sharma"
              value={googleName}
              onChange={(e) => setGoogleName(e.target.value)}
            />
            <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '4px' }}>
              Authorize Google Sign In
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
