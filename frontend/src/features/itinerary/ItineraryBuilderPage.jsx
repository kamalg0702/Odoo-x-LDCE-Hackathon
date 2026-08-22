import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  MapPin,
  Calendar,
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  Plane,
  Train,
  Car,
  Compass,
  ArrowRight,
  Activity as ActivityIcon
} from 'lucide-react';

import { useTrip } from '../../core/hooks/useTrip';
import { useStops } from '../../core/hooks/useStops';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { TripHeader } from '../../components/layout/TripHeader';
import { RouteMapSvg } from '../../components/shared/RouteMapSvg';
import { ShareModal } from '../../components/shared/ShareModal';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { formatDateRange, calculateDays, addDays } from '../../core/utils/date';
import { formatCurrency } from '../../core/utils/currency';
import { shareApi } from '../../core/api/share.api';
import { activitiesApi } from '../../core/api/activities.api';

// Sortable Stop Item Component
function SortableStopItem({
  stop,
  index,
  totalStops,
  onEdit,
  onDelete,
  onOpenActivities,
  activitiesCount = 0
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: stop.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 250ms cubic-bezier(0.2, 0, 0, 1)',
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 100 : 1,
    touchAction: 'none'
  };

  const days = calculateDays(stop.arrival_date, stop.departure_date);

  const transportIcons = {
    Flight: Plane,
    Train: Train,
    Drive: Car,
    Bus: Compass
  };
  const TransportIcon = transportIcons[stop.transport_mode] || Plane;

  return (
    <div ref={setNodeRef} style={style} className="animate-fade-in">
      <Card
        padding="none"
        style={{
          display: 'flex',
          overflow: 'hidden',
          // FIXED: hardcoded white → var(--paper-card)
          backgroundColor: 'var(--paper-card)',
          border: isDragging ? '2px solid var(--traverse)' : '1px solid var(--mist)',
          boxShadow: isDragging ? 'var(--shadow-xl)' : 'var(--shadow-sm)'
        }}
      >
        {/* Drag Handle Bar */}
        <div
          {...attributes}
          {...listeners}
          style={{
            width: '40px',
            backgroundColor: 'var(--paper)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'grab',
            borderRight: '1px solid var(--mist)',
            color: 'var(--ink-subtle)'
          }}
          title="Drag to reorder stop"
        >
          <GripVertical size={20} />
        </div>

        {/* City Image Thumbnail */}
        {stop.city?.image_url && (
          <div
            style={{
              width: '120px',
              backgroundImage: `url(${stop.city.image_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              flexShrink: 0
            }}
          />
        )}

        {/* Content Body */}
        <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--ink)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '800'
                  }}
                >
                  {index + 1}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--ink)' }}>
                  {stop.city?.name || 'City Stop'}
                </h3>
                <span style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
                  {stop.city?.country}
                </span>
              </div>

              {/* Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Badge variant="gray" size="sm" icon={TransportIcon}>
                  {stop.transport_mode || 'Flight'}
                </Badge>
                {stop.budget_estimate > 0 && (
                  <span className="font-data" style={{ fontSize: '12px', fontWeight: '600', color: 'var(--terrain)' }}>
                    Est: {formatCurrency(stop.budget_estimate)}
                  </span>
                )}
              </div>
            </div>

            {/* Dates & notes */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--ink-muted)', marginTop: '6px' }}>
              <Calendar size={14} style={{ color: 'var(--traverse)' }} />
              <span>{formatDateRange(stop.arrival_date, stop.departure_date)} ({days} {days === 1 ? 'day' : 'days'})</span>
            </div>

            {stop.notes && (
              <p style={{ fontSize: '12px', color: 'var(--ink-muted)', marginTop: '6px', backgroundColor: 'var(--sand)', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}>
                {stop.notes}
              </p>
            )}
          </div>

          {/* Actions Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--mist)', paddingTop: '10px' }}>
            <Button
              size="sm"
              variant="secondary"
              icon={ActivityIcon}
              onClick={() => onOpenActivities(stop.id)}
            >
              {activitiesCount > 0 ? `${activitiesCount} Scheduled Activities` : 'Add Activities & Sights'}
            </Button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => onEdit(stop)}
                style={{ padding: '6px', borderRadius: 'var(--radius-sm)', color: 'var(--ink-muted)' }}
                title="Edit dates & notes"
              >
                <Edit2 size={15} />
              </button>
              <button
                onClick={() => onDelete(stop.id)}
                style={{ padding: '6px', borderRadius: 'var(--radius-sm)', color: 'var(--alert)' }}
                title="Remove stop"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function ItineraryBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tripId = parseInt(id, 10);

  const { currentTrip, fetchTripById } = useTrip();
  const { stops, fetchStops, deleteStopFromTrip, updateStopDetails, reorderTripStops } = useStops(tripId);

  const [shareData, setShareData] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [editingStop, setEditingStop] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [stopActivitiesCounts, setStopActivitiesCounts] = useState({});

  useEffect(() => {
    fetchTripById(tripId);
    fetchStops().then(async (fetchedStops) => {
      if (fetchedStops) {
        const counts = {};
        for (const s of fetchedStops) {
          try {
            const res = await activitiesApi.getStopActivities(s.id);
            counts[s.id] = res.data.activities?.length || 0;
          } catch {
            counts[s.id] = 0;
          }
        }
        setStopActivitiesCounts(counts);
      }
    });
  }, [tripId, fetchTripById, fetchStops]);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = stops.findIndex((s) => s.id === active.id);
    const newIndex = stops.findIndex((s) => s.id === over.id);
    const newOrderedStops = arrayMove(stops, oldIndex, newIndex);
    const orderedIds = newOrderedStops.map((s) => s.id);
    reorderTripStops(orderedIds);
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

  const handleEditOpen = (stop) => {
    setEditingStop(stop);
    setEditFormData({
      arrival_date: stop.arrival_date,
      departure_date: stop.departure_date,
      transport_mode: stop.transport_mode || 'Flight',
      budget_estimate: stop.budget_estimate || 0,
      notes: stop.notes || ''
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (editingStop) {
      await updateStopDetails(editingStop.id, editFormData);
      setEditingStop(null);
    }
  };

  return (
    <PageWrapper>
      <TripHeader
        trip={currentTrip}
        activeTab="build"
        onTabChange={(tab) => {
          if (tab === 'view') navigate(`/trips/${tripId}/view`);
          if (tab === 'cities') navigate(`/trips/${tripId}/cities`);
          if (tab === 'budget') navigate(`/trips/${tripId}/budget`);
          if (tab === 'calendar') navigate(`/trips/${tripId}/calendar`);
        }}
        onBack={() => navigate('/trips')}
        onShareClick={handleShareClick}
        stopsCount={stops.length}
      />

      {/* Visual Route Line Banner */}
      <Card padding="md" style={{ marginBottom: '28px', backgroundColor: 'var(--paper)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={18} style={{ color: 'var(--traverse)' }} />
            <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--ink)' }}>
              Expedition Route Sequence
            </span>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
            Drag stops below to reorder route flow
          </span>
        </div>
        <RouteMapSvg stops={stops} height={90} animated={true} />
      </Card>

      {/* Stops Reorder Section */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 className="font-display" style={{ fontSize: '20px', fontWeight: '800', color: 'var(--ink)' }}>
            Itinerary Destinations ({stops.length})
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
            Organize destination order, schedule stop activities, and set transport transitions.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => navigate(`/trips/${tripId}/cities`)}
        >
          Add City Destination
        </Button>
      </div>

      {stops.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={stops.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {stops.map((stop, index) => (
                <SortableStopItem
                  key={stop.id}
                  stop={stop}
                  index={index}
                  totalStops={stops.length}
                  onEdit={handleEditOpen}
                  onDelete={deleteStopFromTrip}
                  onOpenActivities={(stopId) => navigate(`/trips/${tripId}/stops/${stopId}/activities`)}
                  activitiesCount={stopActivitiesCounts[stop.id] || 0}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <Card padding="lg" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <MapPin size={40} style={{ color: 'var(--traverse)', margin: '0 auto 12px' }} />
          <h3 className="font-display" style={{ fontSize: '18px', fontWeight: '700', color: 'var(--ink)' }}>
            No stops in this journey yet
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)', marginTop: '4px', maxWidth: '400px', margin: '4px auto 20px' }}>
            Explore our curated catalog of 50+ global cities and add your favorite stops with custom dates.
          </p>
          <Button
            variant="primary"
            icon={Plus}
            size="lg"
            onClick={() => navigate(`/trips/${tripId}/cities`)}
          >
            Explore & Add Cities
          </Button>
        </Card>
      )}

      {/* Edit Stop Modal */}
      <Modal
        isOpen={!!editingStop}
        onClose={() => setEditingStop(null)}
        title={`Edit Stop: ${editingStop?.city?.name || 'Destination'}`}
        subtitle="Update travel dates, transition mode, and personal notes."
      >
        <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input
              label="Arrival Date"
              type="date"
              required
              value={editFormData.arrival_date || ''}
              onChange={(e) => setEditFormData({ ...editFormData, arrival_date: e.target.value })}
            />
            <Input
              label="Departure Date"
              type="date"
              required
              value={editFormData.departure_date || ''}
              onChange={(e) => setEditFormData({ ...editFormData, departure_date: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Select
              label="Transport Mode"
              value={editFormData.transport_mode || 'Flight'}
              onChange={(e) => setEditFormData({ ...editFormData, transport_mode: e.target.value })}
              options={[
                { value: 'Flight', label: '✈️ Flight' },
                { value: 'Train', label: '🚆 High-Speed Train' },
                { value: 'Drive', label: '🚗 Car / Rental' },
                { value: 'Bus', label: '🚌 Coach / Bus' },
                { value: 'Ferry', label: '⛴️ Ferry / Boat' }
              ]}
            />
            <Input
              label="Budget Allocation (₹)"
              type="number"
              min="0"
              value={editFormData.budget_estimate || ''}
              onChange={(e) => setEditFormData({ ...editFormData, budget_estimate: e.target.value })}
            />
          </div>

          <Textarea
            label="Stop Notes & Reminders"
            placeholder="Hotel name, neighborhood ideas, packing reminders..."
            value={editFormData.notes || ''}
            onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <Button variant="secondary" onClick={() => setEditingStop(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Stop
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
