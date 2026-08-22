import React, { useState } from 'react';
import { User, Mail, DollarSign, Lock, Image, ShieldCheck, LogOut, CheckCircle2, Sparkles } from 'lucide-react';
import { useAuth } from '../../core/hooks/useAuth';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input, Textarea, Select } from '../../components/ui/Input';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
  'https://api.dicebear.com/7.x/bottts/svg?seed=explorer_1',
  'https://api.dicebear.com/7.x/bottts/svg?seed=explorer_2'
];

export default function ProfilePage() {
  const { user, updateProfile, logout, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    avatar_url: user?.avatar_url || '',
    bio: user?.bio || '',
    preferred_currency: user?.preferred_currency || 'USD',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      avatar_url: formData.avatar_url,
      bio: formData.bio,
      preferred_currency: formData.preferred_currency
    };
    if (formData.password) {
      payload.password = formData.password;
    }
    await updateProfile(payload);
    setFormData((prev) => ({ ...prev, password: '' }));
  };

  return (
    <PageWrapper maxWidth="760px">
      <div style={{ marginBottom: '28px' }}>
        <h1 className="font-display" style={{ fontSize: '28px', fontWeight: '800', color: 'var(--ink)' }}>
          Profile & Preferences
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginTop: '2px' }}>
          Personalize your travel profile, currency defaults, and security settings.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Avatar & Role Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', borderBottom: '1px solid var(--mist)', paddingBottom: '24px' }}>
            <img
              src={formData.avatar_url || user?.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=traveler'}
              alt={user?.name}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--traverse-light)',
                boxShadow: 'var(--shadow-sm)'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--ink)' }}>{user?.name}</h3>
                <Badge variant={user?.role === 'admin' ? 'gold' : 'blue'}>
                  {user?.role === 'admin' ? 'ADMINISTRATOR' : 'TRAVELER'}
                </Badge>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--ink-muted)', marginTop: '2px' }}>
                {user?.email}
              </div>
            </div>
          </div>

          {/* Avatar Presets Selection */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ink)', marginBottom: '8px', display: 'block' }}>
              Choose Profile Avatar
            </label>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '10px' }}>
              {AVATAR_PRESETS.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt="Preset"
                  onClick={() => setFormData({ ...formData, avatar_url: url })}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    objectFit: 'cover',
                    border: formData.avatar_url === url ? '2px solid var(--traverse)' : '2px solid transparent',
                    boxShadow: formData.avatar_url === url ? '0 0 0 2px var(--traverse-ring)' : 'none',
                    transition: 'all var(--transition-fast)'
                  }}
                />
              ))}
            </div>
            <Input
              icon={Image}
              placeholder="Or paste a custom avatar image URL..."
              value={formData.avatar_url}
              onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
            />
          </div>

          {/* Form Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input
              label="Full Name"
              icon={User}
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <Select
              label="Preferred Currency"
              value={formData.preferred_currency}
              onChange={(e) => setFormData({ ...formData, preferred_currency: e.target.value })}
              options={[
                { value: 'USD', label: 'USD ($ - US Dollar)' },
                { value: 'EUR', label: 'EUR (€ - Euro)' },
                { value: 'GBP', label: 'GBP (£ - British Pound)' },
                { value: 'JPY', label: 'JPY (¥ - Japanese Yen)' },
                { value: 'AUD', label: 'AUD (A$ - Australian Dollar)' },
                { value: 'CAD', label: 'CAD (C$ - Canadian Dollar)' },
                { value: 'INR', label: 'INR (₹ - Indian Rupee)' }
              ]}
            />
          </div>

          <Textarea
            label="Traveler Bio"
            placeholder="Tell fellow travelers about your bucket-list style, favorite cuisines, and travel philosophies..."
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />

          <div style={{ borderTop: '1px solid var(--mist)', paddingTop: '20px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--ink)', marginBottom: '4px' }}>
              Security & Password
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '14px' }}>
              Leave blank if you do not wish to change your existing password.
            </p>
            <Input
              label="New Password"
              type="password"
              icon={Lock}
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--mist)', paddingTop: '20px' }}>
            <Button
              variant="outline"
              icon={LogOut}
              onClick={logout}
            >
              Log Out
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              icon={Sparkles}
            >
              Save Profile Changes
            </Button>
          </div>
        </Card>
      </form>
    </PageWrapper>
  );
}
