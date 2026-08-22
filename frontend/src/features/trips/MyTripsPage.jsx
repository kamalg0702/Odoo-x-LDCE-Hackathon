import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Compass, Calendar, Sparkles } from 'lucide-react';
import { useTrip } from '../../core/hooks/useTrip';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { TripCard } from '../../components/shared/TripCard';
import { ShareModal } from '../../components/shared/ShareModal';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/shared/EmptyState';
import { shareApi } from '../../core/api/share.api';
import { stopsApi } from '../../core/api/stops.api';

export default function MyTripsPage() {
  const navigate = useNavigate();
  const { trips, fetchTrips, deleteTrip, isLoading } = useTrip();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [tripStopsMap, setTripStopsMap] = useState({});

  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [shareTargetTrip, setShareTargetTrip] = useState(null);
  const [shareData, setShareData] = useState(null);

  useEffect(() => {
    fetchTrips().then(async (userTrips) => {
      if (userTrips && userTrips.length > 0) {
        const stopMap = {};
        for (const t of userTrips) {
          try {
            const res = await stopsApi.getStops(t.id);
            stopMap[t.id] = res.data.stops || [];
          } catch {
            stopMap[t.id] = [];
          }
        }
        setTripStopsMap(stopMap);
      }
    });
  }, [fetchTrips]);

  const handleShare = async (trip) => {
    setShareTargetTrip(trip);
    try {
      const res = await shareApi.shareTrip(trip.id);
      setShareData(res.data);
    } catch {
      setShareData({ slug: trip.share_slug });
    }
  };

  const confirmDelete = async () => {
    if (deleteTargetId) {
      await deleteTrip(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  // Filter trips
  const filteredTrips = trips.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'ALL' ||
      (statusFilter === 'PUBLIC' ? t.is_public : (t.status || 'planning').toUpperCase() === statusFilter);

    return matchesSearch && matchesStatus;
  });

  return (
    <PageWrapper>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <h1 className="font-display" style={{ fontSize: '28px', fontWeight: '800', color: 'var(--ink)' }}>
            My Travel Itineraries
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginTop: '2px' }}>
            Manage your personalized journeys, multi-city routes, and scheduled plans.
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          size="lg"
          onClick={() => navigate('/trips/new')}
        >
          Create New Trip
        </Button>
      </div>

      {/* Filters Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          // FIXED: hardcoded white → var(--paper-card)
          backgroundColor: 'var(--paper-card)',
          padding: '16px 20px',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--mist)',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ width: '100%', maxWidth: '320px' }}>
          <Input
            icon={Search}
            placeholder="Search by trip name or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Pills */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
          {['ALL', 'PLANNING', 'UPCOMING', 'COMPLETED', 'PUBLIC'].map((st) => {
            const isSelected = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '12px',
                  fontWeight: isSelected ? '700' : '500',
                  backgroundColor: isSelected ? 'var(--ink)' : 'var(--sand)',
                  color: isSelected ? '#FFFFFF' : 'var(--ink-muted)',
                  whiteSpace: 'nowrap',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      {filteredTrips.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {filteredTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              stops={tripStopsMap[trip.id] || []}
              onOpen={(id) => navigate(`/trips/${id}/build`)}
              onDelete={(id) => setDeleteTargetId(id)}
              onShare={handleShare}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No itineraries found"
          description={searchQuery ? "No journeys match your current search criteria." : "You haven't created any trips yet."}
          actionLabel="Create a Trip Now"
          onAction={() => navigate('/trips/new')}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        title="Delete Itinerary"
        subtitle="Are you sure you want to permanently delete this trip and all its stops?"
        maxWidth="440px"
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
          <Button variant="secondary" onClick={() => setDeleteTargetId(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Yes, Delete Trip
          </Button>
        </div>
      </Modal>

      {/* Share Modal */}
      {shareTargetTrip && (
        <ShareModal
          isOpen={!!shareTargetTrip}
          onClose={() => setShareTargetTrip(null)}
          trip={shareTargetTrip}
          shareData={shareData}
          onGenerateLink={() => handleShare(shareTargetTrip)}
        />
      )}
    </PageWrapper>
  );
}
