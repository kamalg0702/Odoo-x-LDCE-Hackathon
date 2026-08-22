import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, MapPin, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTrip } from '../../core/hooks/useTrip';
import { useStops } from '../../core/hooks/useStops';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { TripHeader } from '../../components/layout/TripHeader';
import { ShareModal } from '../../components/shared/ShareModal';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatDate, calculateDays, addDays } from '../../core/utils/date';
import { activitiesApi } from '../../core/api/activities.api';
import { shareApi } from '../../core/api/share.api';

const STOP_COLORS = [
  { bg: 'rgba(37, 99, 235, 0.1)', border: 'var(--traverse)', text: 'var(--traverse)' },
  { bg: 'rgba(5, 150, 105, 0.1)', border: 'var(--terrain)', text: 'var(--terrain)' },
  { bg: 'rgba(217, 119, 6, 0.1)', border: 'var(--gold)', text: 'var(--gold)' },
  { bg: 'rgba(124, 58, 237, 0.1)', border: '#7C3AED', text: '#7C3AED' },
  { bg: 'rgba(220, 38, 38, 0.1)', border: 'var(--alert)', text: 'var(--alert)' }
];

export default function CalendarTimelinePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tripId = parseInt(id, 10);

  const { currentTrip, fetchTripById } = useTrip();
  const { stops, fetchStops } = useStops(tripId);

  const [allActivities, setAllActivities] = useState([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareData, setShareData] = useState(null);

  useEffect(() => {
    fetchTripById(tripId);
    fetchStops().then(async (fetchedStops) => {
      if (fetchedStops && fetchedStops.length > 0) {
        let acts = [];
        for (const s of fetchedStops) {
          try {
            const res = await activitiesApi.getStopActivities(s.id);
            const enriched = (res.data.activities || []).map(a => ({
              ...a,
              stopCity: s.city?.name,
              stopCountry: s.city?.country,
              stopIndex: s.order_index
            }));
            acts = [...acts, ...enriched];
          } catch {}
        }
        setAllActivities(acts);
      }
    });
  }, [tripId, fetchTripById, fetchStops]);

  const handleShareClick = async () => {
    setIsShareModalOpen(true);
    try {
      const res = await shareApi.shareTrip(tripId);
      setShareData(res.data);
    } catch {
      setShareData({ slug: currentTrip?.share_slug });
    }
  };

  // Generate day-by-day dates array
  const totalDays = currentTrip ? calculateDays(currentTrip.start_date, currentTrip.end_date) : 0;
  const daysList = [];
  if (currentTrip) {
    for (let i = 0; i < totalDays; i++) {
      const currentDate = addDays(currentTrip.start_date, i);
      // Find which stop is active on this day
      const activeStop = stops.find((s) => currentDate >= s.arrival_date && currentDate <= s.departure_date);
      // Find activities scheduled on this day
      const dayActivities = allActivities.filter((a) => a.scheduled_date === currentDate);
      
      daysList.push({
        dayNumber: i + 1,
        date: currentDate,
        stop: activeStop,
        activities: dayActivities
      });
    }
  }

  return (
    <PageWrapper>
      <TripHeader
        trip={currentTrip}
        activeTab="calendar"
        onTabChange={(tab) => {
          if (tab === 'build') navigate(`/trips/${tripId}/build`);
          if (tab === 'view') navigate(`/trips/${tripId}/view`);
          if (tab === 'cities') navigate(`/trips/${tripId}/cities`);
          if (tab === 'budget') navigate(`/trips/${tripId}/budget`);
        }}
        onBack={() => navigate('/trips')}
        onShareClick={handleShareClick}
        stopsCount={stops.length}
      />

      <div style={{ marginBottom: '24px' }}>
        <h2 className="font-display" style={{ fontSize: '24px', fontWeight: '800', color: 'var(--ink)' }}>
          Day-by-Day Journey Timeline
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginTop: '2px' }}>
          Visual chronological schedule of destination stays, tours, and experiences.
        </p>
      </div>

      {/* Stop Transit Ribbon Overview */}
      <Card padding="md" style={{ marginBottom: '28px', backgroundColor: '#FFFFFF' }}>
        <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700', color: 'var(--ink-muted)', marginBottom: '12px' }}>
          Destination Stay Durations
        </div>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {stops.map((stop, idx) => {
            const days = calculateDays(stop.arrival_date, stop.departure_date);
            const colorTheme = STOP_COLORS[idx % STOP_COLORS.length];
            return (
              <div
                key={stop.id}
                style={{
                  flex: 1,
                  minWidth: '180px',
                  backgroundColor: colorTheme.bg,
                  border: `1px solid ${colorTheme.border}`,
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-lg)'
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: '700', color: colorTheme.text, textTransform: 'uppercase' }}>
                  Stop {idx + 1} ({days}d)
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--ink)', marginTop: '2px' }}>
                  {stop.city?.name}
                </h4>
                <div style={{ fontSize: '12px', color: 'var(--ink-muted)', marginTop: '2px' }}>
                  {formatDate(stop.arrival_date, { month: 'short', day: 'numeric' })} – {formatDate(stop.departure_date, { month: 'short', day: 'numeric' })}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Day by Day Vertical Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {daysList.map((day) => {
          const stopIndex = day.stop ? stops.findIndex(s => s.id === day.stop.id) : 0;
          const colorTheme = STOP_COLORS[stopIndex % STOP_COLORS.length];

          return (
            <Card
              key={day.date}
              padding="none"
              style={{
                overflow: 'hidden',
                borderLeft: `5px solid ${day.stop ? colorTheme.border : 'var(--mist-dark)'}`
              }}
            >
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--paper)', borderBottom: '1px solid var(--mist)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: '800',
                      backgroundColor: 'var(--ink)',
                      color: '#FFFFFF',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)'
                    }}
                  >
                    Day {day.dayNumber}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--ink)' }}>
                    {formatDate(day.date, { weekday: 'long', month: 'short', day: 'numeric' })}
                  </span>
                </div>

                {day.stop ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: colorTheme.text }}>
                    <MapPin size={15} />
                    <span>{day.stop.city?.name}, {day.stop.city?.country}</span>
                  </div>
                ) : (
                  <span style={{ fontSize: '12px', color: 'var(--ink-muted)', fontStyle: 'italic' }}>
                    Transit / Free Day
                  </span>
                )}
              </div>

              {/* Activities on this day */}
              <div style={{ padding: '16px 20px' }}>
                {day.activities && day.activities.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {day.activities.map((act) => (
                      <div
                        key={act.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          backgroundColor: act.is_completed ? 'var(--paper)' : '#FFFFFF',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--mist)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {act.scheduled_time && (
                            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--traverse)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={13} />
                              {act.scheduled_time}
                            </span>
                          )}
                          <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--ink)', textDecoration: act.is_completed ? 'line-through' : 'none' }}>
                            {act.activity?.name || 'Scheduled Activity'}
                          </span>
                          <Badge variant="blue" size="sm">
                            {act.activity?.category || 'Sight'}
                          </Badge>
                        </div>

                        {act.is_completed && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--terrain)', fontWeight: '600' }}>
                            <CheckCircle2 size={14} /> Completed
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '13px', color: 'var(--ink-muted)', fontStyle: 'italic' }}>
                    No scheduled activities for this day. Free exploration or transit time.
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          trip={currentTrip}
          shareData={shareData}
          onGenerateLink={handleShareClick}
        />
      )}
    </PageWrapper>
  );
}
