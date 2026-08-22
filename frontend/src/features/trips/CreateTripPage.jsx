import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Calendar, DollarSign, Image, ArrowLeft, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTrip } from '../../core/hooks/useTrip';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Card } from '../../components/ui/Card';
import { Input, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { calculateDays, getTodayString, addDays } from '../../core/utils/date';

const PRESET_COVERS = [
  { label: 'Alpine & Peaks', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200' },
  { label: 'Parisian Charm', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200' },
  { label: 'Tropical Coast', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200' },
  { label: 'Tokyo Neon & City', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200' },
  { label: 'Mediterranean Blue', url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200' },
  { label: 'Desert Oasis', url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200' }
];

export default function CreateTripPage() {
  const navigate = useNavigate();
  const { createNewTrip, isLoading } = useTrip();

  const today = getTodayString();
  const defaultEnd = addDays(today, 7);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: today,
    end_date: defaultEnd,
    total_budget: '',
    cover_photo_url: PRESET_COVERS[0].url,
    is_public: false
  });

  const [dateError, setDateError] = useState('');

  const days = calculateDays(formData.start_date, formData.end_date);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.start_date > formData.end_date) {
      setDateError('End date cannot be earlier than start date');
      return;
    }

    try {
      const trip = await createNewTrip({
        name: formData.name,
        description: formData.description,
        start_date: formData.start_date,
        end_date: formData.end_date,
        total_budget: formData.total_budget ? Number(formData.total_budget) : 0,
        cover_photo_url: formData.cover_photo_url,
        is_public: formData.is_public
      });

      // Celebration confetti
      try {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      } catch {}

      // Navigate to Itinerary Builder
      navigate(`/trips/${trip.id}/build`);
    } catch (err) {
      // Error handled by hook toast
    }
  };

  return (
    <PageWrapper maxWidth="840px">
      <button
        onClick={() => navigate('/trips')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          fontWeight: '600',
          color: 'var(--ink-muted)',
          marginBottom: '16px'
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to My Trips</span>
      </button>

      <div style={{ marginBottom: '24px' }}>
        <h1 className="font-display" style={{ fontSize: '28px', fontWeight: '800', color: 'var(--ink)' }}>
          Create New Journey
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginTop: '4px' }}>
          Set your journey dates, target budget, and cover styling. You'll add multi-city stops and activities next!
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Trip Name */}
          <Input
            label="Trip Name"
            placeholder="e.g. Mediterranean Coast & Tapas Odyssey"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            helperText="Give your expedition a memorable title."
          />

          {/* Dates & Duration */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <Input
              label="Start Date"
              type="date"
              required
              value={formData.start_date}
              onChange={(e) => {
                setDateError('');
                setFormData({ ...formData, start_date: e.target.value });
              }}
            />
            <Input
              label="End Date"
              type="date"
              required
              value={formData.end_date}
              error={dateError}
              onChange={(e) => {
                setDateError('');
                setFormData({ ...formData, end_date: e.target.value });
              }}
              helperText={`Total Duration: ${days} ${days === 1 ? 'day' : 'days'}`}
            />
          </div>

          {/* Budget & Public Toggle */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <Input
              label="Target Budget (USD, Optional)"
              type="number"
              min="0"
              step="50"
              icon={DollarSign}
              placeholder="e.g. 3500"
              value={formData.total_budget}
              onChange={(e) => setFormData({ ...formData, total_budget: e.target.value })}
              helperText="Set an overall spending limit to monitor in real-time."
            />

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '10px 0' }}>
                <input
                  type="checkbox"
                  checked={formData.is_public}
                  onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--traverse)', cursor: 'pointer' }}
                />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--ink)' }}>Enable Public Share Link</div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>Generate a public link anyone can view.</div>
                </div>
              </label>
            </div>
          </div>

          {/* Trip Description */}
          <Textarea
            label="Trip Description / Notes (Optional)"
            placeholder="Share the goals of this trip, companions, packing reminders, or travel ideas..."
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          {/* Cover Photo Selection */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ink)', marginBottom: '8px', display: 'block' }}>
              Select Cover Artwork
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '10px', marginBottom: '12px' }}>
              {PRESET_COVERS.map((preset) => {
                const isSelected = formData.cover_photo_url === preset.url;
                return (
                  <div
                    key={preset.url}
                    onClick={() => setFormData({ ...formData, cover_photo_url: preset.url })}
                    style={{
                      height: '75px',
                      borderRadius: 'var(--radius-md)',
                      backgroundImage: `url(${preset.url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      cursor: 'pointer',
                      border: `2px solid ${isSelected ? 'var(--traverse)' : 'transparent'}`,
                      boxShadow: isSelected ? '0 0 0 2px var(--traverse-ring)' : 'none',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: '4px 6px',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    {isSelected && (
                      <div style={{ position: 'absolute', top: '4px', right: '4px', backgroundColor: 'var(--traverse)', color: '#FFFFFF', borderRadius: '50%', padding: '2px', display: 'flex' }}>
                        <Check size={10} strokeWidth={3} />
                      </div>
                    )}
                    <span style={{ fontSize: '10px', fontWeight: '700', color: '#FFFFFF', backgroundColor: 'rgba(26, 26, 46, 0.75)', padding: '1px 4px', borderRadius: 'var(--radius-sm)' }}>
                      {preset.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <Input
              icon={Image}
              placeholder="Or paste a custom image URL (Unsplash, etc.)..."
              value={formData.cover_photo_url}
              onChange={(e) => setFormData({ ...formData, cover_photo_url: e.target.value })}
            />
          </div>

          {/* Submit Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--mist)', paddingTop: '20px' }}>
            <Button variant="secondary" onClick={() => navigate('/trips')}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              icon={Sparkles}
            >
              Create Trip & Start Building
            </Button>
          </div>
        </Card>
      </form>
    </PageWrapper>
  );
}
