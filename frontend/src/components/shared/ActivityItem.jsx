import React from 'react';
import { Star, Clock, DollarSign, Plus, Check, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../core/utils/currency';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function ActivityItem({
  activity, // can be catalog activity or stop_activity
  isScheduled = false,
  scheduledDetails, // { scheduled_date, scheduled_time, custom_cost }
  onAdd,
  onRemove,
  onSchedule,
  onToggleComplete,
  isCompleted = false
}) {
  const categoryVariant = {
    Culture: 'blue',
    Food: 'gold',
    Adventure: 'green',
    Sightseeing: 'blue',
    Nature: 'green',
    Nightlife: 'red'
  }[activity.category] || 'gray';

  const effectiveCost = scheduledDetails?.custom_cost !== undefined && scheduledDetails?.custom_cost !== null
    ? scheduledDetails.custom_cost
    : activity.cost;

  return (
    <div
      style={{
        display: 'flex',
        gap: '14px',
        padding: '14px',
        backgroundColor: isCompleted ? 'var(--paper)' : '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        border: `1px solid ${isCompleted ? 'var(--sand-dark)' : 'var(--mist)'}`,
        opacity: isCompleted ? 0.75 : 1,
        transition: 'all var(--transition-fast)'
      }}
    >
      {/* Thumbnail */}
      {activity.image_url && (
        <img
          src={activity.image_url}
          alt={activity.name}
          style={{
            width: '84px',
            height: '84px',
            borderRadius: 'var(--radius-md)',
            objectFit: 'cover',
            flexShrink: 0
          }}
        />
      )}

      {/* Info */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '6px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Badge variant={categoryVariant} size="sm">
                {activity.category}
              </Badge>
              {activity.rating && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '12px', fontWeight: '600', color: 'var(--gold)' }}>
                  <Star size={12} fill="var(--gold)" />
                  {activity.rating}
                </span>
              )}
            </div>

            <span className="font-data" style={{ fontSize: '14px', fontWeight: '700', color: effectiveCost === 0 ? 'var(--terrain)' : 'var(--ink)' }}>
              {effectiveCost === 0 ? 'Free' : formatCurrency(effectiveCost)}
            </span>
          </div>

          <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--ink)', marginTop: '4px', textDecoration: isCompleted ? 'line-through' : 'none' }}>
            {activity.name}
          </h4>

          {activity.description && (
            <p style={{ fontSize: '12px', color: 'var(--ink-muted)', marginTop: '2px', lineHeight: '1.4' }}>
              {activity.description}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--sand)', paddingTop: '8px', marginTop: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--ink-muted)' }}>
            {activity.duration_hours && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} />
                {activity.duration_hours}h
              </span>
            )}
            {scheduledDetails?.scheduled_time && (
              <span style={{ fontWeight: '600', color: 'var(--traverse)' }}>
                @{scheduledDetails.scheduled_time}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isScheduled ? (
              <>
                {onToggleComplete && (
                  <button
                    onClick={onToggleComplete}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: isCompleted ? 'var(--terrain-light)' : 'var(--sand)',
                      color: isCompleted ? 'var(--terrain)' : 'var(--ink)'
                    }}
                  >
                    <Check size={12} />
                    {isCompleted ? 'Done' : 'Mark Done'}
                  </button>
                )}
                {onRemove && (
                  <button
                    onClick={onRemove}
                    style={{ padding: '4px 6px', color: 'var(--alert)', borderRadius: 'var(--radius-sm)' }}
                    title="Remove from stop"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </>
            ) : (
              onAdd && (
                <Button size="sm" variant="secondary" icon={Plus} onClick={onAdd}>
                  Add to Stop
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
