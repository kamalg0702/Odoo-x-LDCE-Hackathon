import React from 'react';
import { Calendar, MapPin, DollarSign, ArrowRight, Trash2, Edit3, Share2 } from 'lucide-react';
import { formatDateRange, calculateDays } from '../../core/utils/date';
import { formatCurrency } from '../../core/utils/currency';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { RouteMapSvg } from './RouteMapSvg';

export function TripCard({
  trip,
  onOpen,
  onEdit,
  onDelete,
  onShare,
  stops = []
}) {
  const days = calculateDays(trip.start_date, trip.end_date);
  const stopCount = stops.length;

  return (
    <Card
      padding="none"
      interactive
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        cursor: 'pointer'
      }}
      onClick={() => onOpen(trip.id)}
    >
      {/* Cover Image Header */}
      <div
        style={{
          position: 'relative',
          height: '160px',
          backgroundImage: `linear-gradient(to top, rgba(26, 26, 46, 0.8) 0%, rgba(26, 26, 46, 0.1) 100%), url(${trip.cover_photo_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Badge variant={trip.status === 'completed' ? 'green' : 'blue'}>
            {trip.status ? trip.status.toUpperCase() : 'PLANNING'}
          </Badge>
          {trip.is_public && (
            <Badge variant="gold">
              PUBLIC
            </Badge>
          )}
        </div>

        <div>
          <h3 className="font-display" style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: '700', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
            {trip.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255, 255, 255, 0.9)', fontSize: '12px', marginTop: '2px' }}>
            <Calendar size={13} />
            <span>{formatDateRange(trip.start_date, trip.end_date)} ({days}d)</span>
          </div>
        </div>
      </div>

      {/* Signature SVG Mini Route Path */}
      <div style={{ padding: '12px 16px 4px', backgroundColor: 'var(--paper)', borderBottom: '1px solid var(--mist)' }}>
        <RouteMapSvg stops={stops} height={60} animated={false} />
      </div>

      {/* Details Body */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: 'space-between' }}>
        {trip.description ? (
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {trip.description}
          </p>
        ) : (
          <div style={{ fontSize: '13px', color: 'var(--ink-subtle)', fontStyle: 'italic' }}>
            No description added yet.
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--mist)', paddingTop: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--ink)' }}>
              <MapPin size={14} style={{ color: 'var(--traverse)' }} />
              <span style={{ fontWeight: '600' }}>{stopCount}</span> {stopCount === 1 ? 'Stop' : 'Stops'}
            </div>
            {trip.total_budget > 0 && (
              <div className="font-data" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--terrain)' }}>
                {formatCurrency(trip.total_budget)}
              </div>
            )}
          </div>

          {/* Quick Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
            {onShare && (
              <button
                onClick={() => onShare(trip)}
                style={{ padding: '6px', borderRadius: 'var(--radius-sm)', color: 'var(--ink-muted)' }}
                title="Share link"
              >
                <Share2 size={15} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(trip.id)}
                style={{ padding: '6px', borderRadius: 'var(--radius-sm)', color: 'var(--alert)' }}
                title="Delete trip"
              >
                <Trash2 size={15} />
              </button>
            )}
            <Button
              size="sm"
              variant="secondary"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => onOpen(trip.id)}
            >
              Plan
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
