import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, Clock, Check, Plus, Edit3, Compass, Share2, Layers } from 'lucide-react';
import { useTrip } from '../../core/hooks/useTrip';
import { useStops } from '../../core/hooks/useStops';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { TripHeader } from '../../components/layout/TripHeader';
import { RouteMapSvg } from '../../components/shared/RouteMapSvg';
import { ActivityItem } from '../../components/shared/ActivityItem';
import { ShareModal } from '../../components/shared/ShareModal';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatDateRange, calculateDays, formatDate } from '../../core/utils/date';
import { formatCurrency } from '../../core/utils/currency';
import { activitiesApi } from '../../core/api/activities.api';
import { shareApi } from '../../core/api/share.api';

export default function ItineraryViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tripId = parseInt(id, 10);

  const { currentTrip, fetchTripById } = useTrip();
  const { stops, fetchStops } = useStops(tripId);

  const [stopActivitiesMap, setStopActivitiesMap] = useState({});
  const [shareData, setShareData] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    fetchTripById(tripId);
    fetchStops().then(async (fetchedStops) => {
      if (fetchedStops && fetchedStops.length > 0) {
        const actMap = {};
        for (const s of fetchedStops) {
          try {
            const res = await activitiesApi.getStopActivities(s.id);
            actMap[s.id] = res.data.activities || [];
          } catch {
            actMap[s.id] = [];
          }
        }
        setStopActivitiesMap(actMap);
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

  const handleToggleActivityComplete = async (stopId, actId, currentStatus) => {
    try {
      await activitiesApi.updateStopActivity(stopId, actId, { is_completed: !currentStatus });
      // Update local state
      setStopActivitiesMap((prev) => ({
        ...prev,
        [stopId]: (prev[stopId] || []).map((a) =>
          a.id === actId ? { ...a, is_completed: !currentStatus } : a
        )
      }));
    } catch {}
  };

  return (
    <PageWrapper>
      <TripHeader
        trip={currentTrip}
        activeTab="view"
        onTabChange={(tab) => {
          if (tab === 'build') navigate(`/trips/${tripId}/build`);
          if (tab === 'cities') navigate(`/trips/${tripId}/cities`);
          if (tab === 'budget') navigate(`/trips/${tripId}/budget`);
          if (tab === 'calendar') navigate(`/trips/${tripId}/calendar`);
        }}
        onBack={() => navigate('/trips')}
        onShareClick={handleShareClick}
        stopsCount={stops.length}
      />

      {/* Cartographic Journey Map Route */}
      <Card padding="md" style={{ marginBottom: '32px', backgroundColor: 'var(--paper)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={18} style={{ color: 'var(--traverse)' }} />
            <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--ink)' }}>
              Complete Journey Blueprint
            </span>
          </div>
          <Button
            size="sm"
            variant="secondary"
            icon={Layers}
            onClick={() => navigate(`/trips/${tripId}/build`)}
          >
            Edit Order in Builder
          </Button>
        </div>
        <RouteMapSvg stops={stops} height={100} animated={true} />
      </Card>

      {/* Chronological Itinerary Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {stops.map((stop, index) => {
          const days = calculateDays(stop.arrival_date, stop.departure_date);
          const stopActs = stopActivitiesMap[stop.id] || [];

          return (
            <div key={stop.id} style={{ position: 'relative' }}>
              {/* Stop Header Banner */}
              <Card
                padding="none"
                style={{
                  overflow: 'hidden',
                  marginBottom: '16px',
                  border: '1px solid var(--mist)'
                }}
              >
                <div
                  style={{
                    height: '140px',
                    backgroundImage: `linear-gradient(to top, rgba(26, 26, 46, 0.85) 0%, rgba(26, 26, 46, 0.2) 100%), url(${stop.city?.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    padding: '20px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    color: '#FFFFFF'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          backgroundColor: 'var(--traverse)',
                          color: '#FFFFFF',
                          padding: '3px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '12px',
                          fontWeight: '800'
                        }}
                      >
                        Stop {index + 1}
                      </span>
                      <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)' }}>
                        {stop.transport_mode ? `Transit via ${stop.transport_mode}` : 'Arrival'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={Plus}
                        onClick={() => navigate(`/trips/${tripId}/stops/${stop.id}/activities`)}
                      >
                        Find Activities
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display" style={{ fontSize: '24px', fontWeight: '800', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                      {stop.city?.name}, {stop.city?.country}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)', marginTop: '2px' }}>
                      <Calendar size={13} />
                      <span>{formatDateRange(stop.arrival_date, stop.departure_date)} ({days} {days === 1 ? 'day' : 'days'})</span>
                    </div>
                  </div>
                </div>

                {stop.notes && (
                  <div style={{ padding: '12px 20px', backgroundColor: 'var(--sand)', fontSize: '13px', color: 'var(--ink)' }}>
                    <strong>Notes:</strong> {stop.notes}
                  </div>
                )}
              </Card>

              {/* Scheduled Activities for this Stop */}
              <div style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {stopActs.length > 0 ? (
                  stopActs.map((sa) => (
                    <ActivityItem
                      key={sa.id}
                      activity={sa.activity || { name: 'Activity', category: 'Sightseeing', cost: sa.custom_cost || 0 }}
                      isScheduled={true}
                      scheduledDetails={{
                        scheduled_date: sa.scheduled_date,
                        scheduled_time: sa.scheduled_time,
                        custom_cost: sa.custom_cost
                      }}
                      isCompleted={sa.is_completed}
                      onToggleComplete={() => handleToggleActivityComplete(stop.id, sa.id, sa.is_completed)}
                    />
                  ))
                ) : (
                  <div
                    style={{
                      padding: '20px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px dashed var(--mist-dark)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
                      No activities scheduled in {stop.city?.name || 'this city'} yet.
                    </span>
                    <Button
                      size="sm"
                      variant="secondary"
                      icon={Plus}
                      onClick={() => navigate(`/trips/${tripId}/stops/${stop.id}/activities`)}
                    >
                      Browse {stop.city?.name || 'City'} Activities
                    </Button>
                  </div>
                )}
              </div>
            </div>
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
