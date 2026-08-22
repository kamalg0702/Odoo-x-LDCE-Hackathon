import React from 'react';
import { Calendar, DollarSign, Share2, Layers, Eye, MapPin, Sparkles, ArrowLeft } from 'lucide-react';
import { formatDateRange, calculateDays } from '../../core/utils/date';
import { formatCurrency } from '../../core/utils/currency';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function TripHeader({
  trip,
  activeTab, // 'build', 'view', 'cities', 'budget', 'calendar'
  onTabChange,
  onBack,
  onShareClick,
  stopsCount = 0
}) {
  if (!trip) return null;

  const durationDays = calculateDays(trip.start_date, trip.end_date);

  const tabs = [
    { id: 'build', label: 'Itinerary Builder', icon: Layers, badge: stopsCount },
    { id: 'view', label: 'Trip Overview', icon: Eye },
    { id: 'cities', label: 'City Catalog', icon: MapPin },
    { id: 'budget', label: 'Budget & Costs', icon: DollarSign },
    { id: 'calendar', label: 'Timeline Calendar', icon: Calendar },
  ];

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          fontWeight: '600',
          color: 'var(--ink-muted)',
          marginBottom: '14px',
          padding: '4px 8px',
          borderRadius: 'var(--radius-sm)'
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to My Trips</span>
      </button>

      {/* Hero Banner Card */}
      <div
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          backgroundColor: 'var(--ink)',
          color: '#FFFFFF',
          minHeight: '180px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '28px',
          boxShadow: 'var(--shadow-md)',
          backgroundImage: `linear-gradient(to top, rgba(26, 26, 46, 0.95) 0%, rgba(26, 26, 46, 0.4) 100%), url(${trip.cover_photo_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', position: 'relative', zIndex: 2 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Badge variant={trip.status === 'completed' ? 'green' : 'blue'}>
                {trip.status ? trip.status.toUpperCase() : 'PLANNING'}
              </Badge>
              {trip.is_public && (
                <Badge variant="gold">
                  PUBLIC
                </Badge>
              )}
              <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} />
                {formatDateRange(trip.start_date, trip.end_date)} ({durationDays} days)
              </span>
            </div>

            <h1 className="font-display" style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px', color: '#FFFFFF', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              {trip.name}
            </h1>
            {trip.description && (
              <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.85)', maxWidth: '650px', marginTop: '6px', lineHeight: '1.4' }}>
                {trip.description}
              </p>
            )}
          </div>

          {/* Quick Metrics & Share */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {trip.total_budget > 0 && (
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', padding: '10px 16px', borderRadius: 'var(--radius-lg)', textAlign: 'right', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'rgba(255, 255, 255, 0.8)' }}>Target Budget</div>
                <div className="font-data" style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF' }}>{formatCurrency(trip.total_budget)}</div>
              </div>
            )}
            <Button
              variant="terrain"
              icon={Share2}
              onClick={onShareClick}
              size="md"
            >
              Share Trip
            </Button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--mist)', marginTop: '20px', paddingBottom: '2px', overflowX: 'auto' }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 18px',
                fontSize: '14px',
                fontWeight: isActive ? '700' : '500',
                color: isActive ? 'var(--traverse)' : 'var(--ink-muted)',
                borderBottom: `2px solid ${isActive ? 'var(--traverse)' : 'transparent'}`,
                backgroundColor: 'transparent',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isActive ? 'var(--traverse-light)' : 'var(--sand)',
                    color: isActive ? 'var(--traverse)' : 'var(--ink-muted)'
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
