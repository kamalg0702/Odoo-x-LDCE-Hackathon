import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Plus, Calendar, Clock, DollarSign, ArrowLeft, Star, Tag, Check, Sparkles } from 'lucide-react';
import { useTrip } from '../../core/hooks/useTrip';
import { useStops } from '../../core/hooks/useStops';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { TripHeader } from '../../components/layout/TripHeader';
import { ActivityItem } from '../../components/shared/ActivityItem';
import { ShareModal } from '../../components/shared/ShareModal';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { formatDateRange } from '../../core/utils/date';
import { formatCurrency } from '../../core/utils/currency';
import { activitiesApi } from '../../core/api/activities.api';
import { shareApi } from '../../core/api/share.api';

const CATEGORIES = ['All', 'Culture', 'Food', 'Adventure', 'Sightseeing', 'Nature', 'Nightlife'];

export default function ActivitySearchPage() {
  const { id, stopId } = useParams();
  const navigate = useNavigate();
  const tripId = parseInt(id, 10);
  const currentStopId = parseInt(stopId, 10);

  const { currentTrip, fetchTripById } = useTrip();
  const { stops, fetchStops } = useStops(tripId);

  const [currentStop, setCurrentStop] = useState(null);
  const [catalogActivities, setCatalogActivities] = useState([]);
  const [scheduledActivities, setScheduledActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Scheduling Modal
  const [targetActivity, setTargetActivity] = useState(null);
  const [scheduleData, setScheduleData] = useState({
    scheduled_date: '',
    scheduled_time: '10:00',
    custom_cost: '',
    notes: ''
  });

  // Create Custom Activity Modal
  const [isCreateCustomOpen, setIsCreateCustomOpen] = useState(false);
  const [customActData, setCustomActData] = useState({
    name: '',
    description: '',
    category: 'Sightseeing',
    cost: '',
    duration_hours: '2.0',
    image_url: ''
  });

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareData, setShareData] = useState(null);

  useEffect(() => {
    fetchTripById(tripId);
    fetchStops();
  }, [tripId, fetchTripById, fetchStops]);

  useEffect(() => {
    if (stops && stops.length > 0) {
      const found = stops.find((s) => s.id === currentStopId);
      if (found) {
        setCurrentStop(found);
        loadCatalogAndScheduled(found.city_id, currentStopId);
      }
    }
  }, [stops, currentStopId]);

  const loadCatalogAndScheduled = async (cityId, stopIdVal) => {
    try {
      const [catRes, schedRes] = await Promise.all([
        activitiesApi.getActivities({ city_id: cityId }),
        activitiesApi.getStopActivities(stopIdVal)
      ]);
      setCatalogActivities(catRes.data.activities || []);
      setScheduledActivities(schedRes.data.activities || []);
    } catch {}
  };

  const handleOpenScheduleModal = (activity) => {
    setTargetActivity(activity);
    setScheduleData({
      scheduled_date: currentStop?.arrival_date || '',
      scheduled_time: '10:00',
      custom_cost: activity.cost || '',
      notes: ''
    });
  };

  const handleConfirmSchedule = async (e) => {
    e.preventDefault();
    if (!targetActivity) return;

    try {
      await activitiesApi.addStopActivity(currentStopId, {
        activity_id: targetActivity.id,
        scheduled_date: scheduleData.scheduled_date || null,
        scheduled_time: scheduleData.scheduled_time || null,
        custom_cost: scheduleData.custom_cost ? Number(scheduleData.custom_cost) : null,
        notes: scheduleData.notes
      });
      // Refresh scheduled activities
      const res = await activitiesApi.getStopActivities(currentStopId);
      setScheduledActivities(res.data.activities || []);
      setTargetActivity(null);
    } catch {}
  };

  const handleRemoveScheduled = async (actId) => {
    try {
      await activitiesApi.deleteStopActivity(currentStopId, actId);
      setScheduledActivities((prev) => prev.filter((a) => a.id !== actId));
    } catch {}
  };

  const handleToggleComplete = async (actId, currentStatus) => {
    try {
      await activitiesApi.updateStopActivity(currentStopId, actId, { is_completed: !currentStatus });
      setScheduledActivities((prev) =>
        prev.map((a) => (a.id === actId ? { ...a, is_completed: !currentStatus } : a))
      );
    } catch {}
  };

  const handleCreateCustomActivity = async (e) => {
    e.preventDefault();
    if (!currentStop) return;

    try {
      const res = await activitiesApi.createActivity({
        name: customActData.name,
        description: customActData.description,
        category: customActData.category,
        cost: customActData.cost ? Number(customActData.cost) : 0,
        duration_hours: Number(customActData.duration_hours) || 2.0,
        city_id: currentStop.city_id,
        image_url: customActData.image_url || currentStop.city?.image_url
      });
      const created = res.data.activity;
      setCatalogActivities((prev) => [created, ...prev]);
      setIsCreateCustomOpen(false);
      // Immediately open schedule modal for convenience
      handleOpenScheduleModal(created);
    } catch {}
  };

  const handleShareClick = async () => {
    setIsShareModalOpen(true);
    try {
      const res = await shareApi.shareTrip(tripId);
      setShareData(res.data);
    } catch {
      setShareData({ slug: currentTrip?.share_slug });
    }
  };

  // Filter catalog
  const filteredCatalog = catalogActivities.filter((act) => {
    const matchesSearch = act.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (act.description && act.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'All' || act.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const scheduledActivityIds = new Set(scheduledActivities.map((sa) => sa.activity_id));

  return (
    <PageWrapper>
      <TripHeader
        trip={currentTrip}
        activeTab="build"
        onTabChange={(tab) => {
          if (tab === 'build') navigate(`/trips/${tripId}/build`);
          if (tab === 'view') navigate(`/trips/${tripId}/view`);
          if (tab === 'cities') navigate(`/trips/${tripId}/cities`);
          if (tab === 'budget') navigate(`/trips/${tripId}/budget`);
          if (tab === 'calendar') navigate(`/trips/${tripId}/calendar`);
        }}
        onBack={() => navigate(`/trips/${tripId}/build`)}
        onShareClick={handleShareClick}
        stopsCount={stops.length}
      />

      {/* Stop Context Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          backgroundColor: '#FFFFFF',
          padding: '20px 24px',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--mist)',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div>
          <button
            onClick={() => navigate(`/trips/${tripId}/build`)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600', color: 'var(--traverse)', marginBottom: '4px' }}
          >
            <ArrowLeft size={14} /> Back to Itinerary Builder
          </button>
          <h2 className="font-display" style={{ fontSize: '22px', fontWeight: '800', color: 'var(--ink)' }}>
            Activities in {currentStop?.city?.name || 'City'}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
            {currentStop && formatDateRange(currentStop.arrival_date, currentStop.departure_date)} • {scheduledActivities.length} Scheduled
          </p>
        </div>

        <Button
          variant="secondary"
          icon={Plus}
          onClick={() => setIsCreateCustomOpen(true)}
        >
          Create Custom Activity
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px', alignItems: 'flex-start' }}>
        
        {/* Left Column: Scheduled Activities for this Stop */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 className="font-display" style={{ fontSize: '18px', fontWeight: '700', color: 'var(--ink)' }}>
              Scheduled for this Stop ({scheduledActivities.length})
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {scheduledActivities.length > 0 ? (
              scheduledActivities.map((sa) => (
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
                  onRemove={() => handleRemoveScheduled(sa.id)}
                  onToggleComplete={() => handleToggleComplete(sa.id, sa.is_completed)}
                />
              ))
            ) : (
              <Card padding="md" style={{ textAlign: 'center', padding: '32px 16px', backgroundColor: 'var(--paper)' }}>
                <p style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
                  No activities scheduled yet. Pick from the curated catalog on the right!
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Right Column: Catalog Activities for this City */}
        <div>
          <div style={{ marginBottom: '14px' }}>
            <h3 className="font-display" style={{ fontSize: '18px', fontWeight: '700', color: 'var(--ink)' }}>
              Curated {currentStop?.city?.name} Sights & Experiences
            </h3>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            <Input
              icon={Search}
              placeholder="Search experiences & tours..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '12px',
                      fontWeight: isSelected ? '700' : '500',
                      backgroundColor: isSelected ? 'var(--ink)' : 'var(--sand)',
                      color: isSelected ? '#FFFFFF' : 'var(--ink-muted)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Catalog List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredCatalog.map((act) => {
              const isAdded = scheduledActivityIds.has(act.id);
              return (
                <ActivityItem
                  key={act.id}
                  activity={act}
                  isScheduled={false}
                  onAdd={() => handleOpenScheduleModal(act)}
                />
              );
            })}
          </div>
        </div>

      </div>

      {/* Schedule Activity Modal */}
      <Modal
        isOpen={!!targetActivity}
        onClose={() => setTargetActivity(null)}
        title={`Schedule: ${targetActivity?.name}`}
        subtitle={`Assign a date and time in ${currentStop?.city?.name}`}
      >
        <form onSubmit={handleConfirmSchedule} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input
              label="Scheduled Date"
              type="date"
              required
              value={scheduleData.scheduled_date}
              min={currentStop?.arrival_date}
              max={currentStop?.departure_date}
              onChange={(e) => setScheduleData({ ...scheduleData, scheduled_date: e.target.value })}
              helperText={`Between ${currentStop?.arrival_date} & ${currentStop?.departure_date}`}
            />
            <Input
              label="Scheduled Time"
              type="time"
              value={scheduleData.scheduled_time}
              onChange={(e) => setScheduleData({ ...scheduleData, scheduled_time: e.target.value })}
            />
          </div>

          <Input
            label="Estimated Cost ($)"
            type="number"
            min="0"
            step="5"
            value={scheduleData.custom_cost}
            onChange={(e) => setScheduleData({ ...scheduleData, custom_cost: e.target.value })}
            helperText="Leave empty to use catalog standard cost."
          />

          <Textarea
            label="Notes / Booking Reference"
            placeholder="Reservation number, ticket link, meeting point..."
            value={scheduleData.notes}
            onChange={(e) => setScheduleData({ ...scheduleData, notes: e.target.value })}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <Button variant="secondary" onClick={() => setTargetActivity(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={Plus}>
              Confirm & Add to Schedule
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Custom Activity Modal */}
      <Modal
        isOpen={isCreateCustomOpen}
        onClose={() => setIsCreateCustomOpen(false)}
        title={`Add Custom Activity in ${currentStop?.city?.name}`}
        subtitle="Create a personalized sightseeing spot, restaurant reservation, or local event."
      >
        <form onSubmit={handleCreateCustomActivity} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Activity Name"
            placeholder="e.g. Sunset drinks at rooftop lounge"
            required
            value={customActData.name}
            onChange={(e) => setCustomActData({ ...customActData, name: e.target.value })}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Select
              label="Category"
              value={customActData.category}
              onChange={(e) => setCustomActData({ ...customActData, category: e.target.value })}
              options={[
                { value: 'Sightseeing', label: 'Sightseeing' },
                { value: 'Culture', label: 'Culture & Art' },
                { value: 'Food', label: 'Food & Dining' },
                { value: 'Adventure', label: 'Adventure' },
                { value: 'Nature', label: 'Nature & Parks' },
                { value: 'Nightlife', label: 'Nightlife' }
              ]}
            />
            <Input
              label="Estimated Cost ($)"
              type="number"
              min="0"
              placeholder="0"
              value={customActData.cost}
              onChange={(e) => setCustomActData({ ...customActData, cost: e.target.value })}
            />
          </div>

          <Textarea
            label="Description"
            placeholder="What makes this experience special?"
            value={customActData.description}
            onChange={(e) => setCustomActData({ ...customActData, description: e.target.value })}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <Button variant="secondary" onClick={() => setIsCreateCustomOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={Plus}>
              Create Activity
            </Button>
          </div>
        </form>
      </Modal>

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
