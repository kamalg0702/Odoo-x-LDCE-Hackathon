import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, MapPin, Plus, Star, DollarSign, Calendar, Globe, Check } from 'lucide-react';
import { useTrip } from '../../core/hooks/useTrip';
import { useStops } from '../../core/hooks/useStops';
import { useCities } from '../../core/hooks/useCities';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { TripHeader } from '../../components/layout/TripHeader';
import { CitySearchBar } from '../../components/shared/CitySearchBar';
import { ShareModal } from '../../components/shared/ShareModal';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { addDays, getTodayString } from '../../core/utils/date';
import { getCostLevel } from '../../core/utils/currency';
import { shareApi } from '../../core/api/share.api';

export default function CitySearchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tripId = parseInt(id, 10);

  const { currentTrip, fetchTripById } = useTrip();
  const { stops, fetchStops, addStopToTrip } = useStops(tripId);
  const { cities, fetchCities, filters, setFilters, isLoading } = useCities();

  const [selectedCityForStop, setSelectedCityForStop] = useState(null);
  const [addFormData, setAddFormData] = useState({
    arrival_date: '',
    departure_date: '',
    transport_mode: 'Flight',
    budget_estimate: 0,
    notes: ''
  });

  const [shareData, setShareData] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    fetchTripById(tripId);
    fetchStops();
    fetchCities();
  }, [tripId, fetchTripById, fetchStops, fetchCities]);

  const handleOpenAddModal = (city) => {
    setSelectedCityForStop(city);

    // Calculate smart default dates based on existing stops or trip start date
    let defaultArrival = currentTrip?.start_date || getTodayString();
    if (stops && stops.length > 0) {
      const lastStop = stops[stops.length - 1];
      defaultArrival = lastStop.departure_date || defaultArrival;
    }
    const defaultDeparture = addDays(defaultArrival, 3);

    setAddFormData({
      arrival_date: defaultArrival,
      departure_date: defaultDeparture,
      transport_mode: 'Flight',
      budget_estimate: city.avg_daily_cost * 3,
      notes: ''
    });
  };

  const handleAddStopSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCityForStop) return;

    await addStopToTrip({
      city_id: selectedCityForStop.id,
      arrival_date: addFormData.arrival_date,
      departure_date: addFormData.departure_date,
      transport_mode: addFormData.transport_mode,
      budget_estimate: Number(addFormData.budget_estimate) || 0,
      notes: addFormData.notes
    });

    setSelectedCityForStop(null);
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

  // Set of city IDs already in this trip
  const existingCityIds = new Set(stops.map((s) => s.city_id));

  return (
    <PageWrapper>
      <TripHeader
        trip={currentTrip}
        activeTab="cities"
        onTabChange={(tab) => {
          if (tab === 'build') navigate(`/trips/${tripId}/build`);
          if (tab === 'view') navigate(`/trips/${tripId}/view`);
          if (tab === 'budget') navigate(`/trips/${tripId}/budget`);
          if (tab === 'calendar') navigate(`/trips/${tripId}/calendar`);
        }}
        onBack={() => navigate('/trips')}
        onShareClick={handleShareClick}
        stopsCount={stops.length}
      />

      <div style={{ marginBottom: '24px' }}>
        <h2 className="font-display" style={{ fontSize: '24px', fontWeight: '800', color: 'var(--ink)' }}>
          Explore & Add Global Destinations
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginTop: '2px' }}>
          Discover 50+ curated destinations worldwide with cost indicators and average daily expense indices.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div style={{ marginBottom: '28px' }}>
        <CitySearchBar
          searchQuery={filters.query}
          onSearchChange={(q) => {
            setFilters({ query: q });
            fetchCities({ query: q });
          }}
          selectedRegion={filters.region}
          onRegionChange={(reg) => {
            setFilters({ region: reg });
            fetchCities({ region: reg });
          }}
          maxCost={filters.maxCost}
          onMaxCostChange={(maxC) => {
            setFilters({ maxCost: maxC });
            fetchCities({ maxCost: maxC });
          }}
        />
      </div>

      {/* Cities Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {cities.map((city) => {
          const isAdded = existingCityIds.has(city.id);
          const costInfo = getCostLevel(city.cost_index);

          return (
            <Card
              key={city.id}
              padding="none"
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                border: isAdded ? '2px solid var(--terrain)' : '1px solid var(--mist)'
              }}
            >
              {/* Cover Image */}
              <div
                style={{
                  height: '160px',
                  backgroundImage: `linear-gradient(to top, rgba(26, 26, 46, 0.8) 0%, rgba(26, 26, 46, 0.1) 100%), url(${city.image_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Badge variant="blue">{city.region}</Badge>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      backgroundColor: 'rgba(26, 26, 46, 0.85)',
                      color: '#FFFFFF',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-full)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <Star size={12} fill="var(--gold)" color="var(--gold)" />
                    {city.popularity_score}
                  </span>
                </div>

                <div>
                  <h3 className="font-display" style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: '700', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                    {city.name}
                  </h3>
                  <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)' }}>
                    {city.country}
                  </span>
                </div>
              </div>

              {/* City Details */}
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, gap: '12px' }}>
                <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {city.description}
                </p>

                <div style={{ borderTop: '1px solid var(--mist)', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-subtle)', fontWeight: '600' }}>
                      Cost: <span style={{ color: 'var(--ink)', fontWeight: '700' }}>{costInfo.dots} ({costInfo.label})</span>
                    </div>
                    <div className="font-data" style={{ fontSize: '13px', fontWeight: '700', color: 'var(--ink)' }}>
                      ~${city.avg_daily_cost}/day
                    </div>
                  </div>

                  {isAdded ? (
                    <Button size="sm" variant="terrain" icon={Check} disabled>
                      In Itinerary
                    </Button>
                  ) : (
                    <Button size="sm" variant="primary" icon={Plus} onClick={() => handleOpenAddModal(city)}>
                      Add Stop
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Stop Modal */}
      <Modal
        isOpen={!!selectedCityForStop}
        onClose={() => setSelectedCityForStop(null)}
        title={`Add ${selectedCityForStop?.name} to Itinerary`}
        subtitle="Set your stop dates and transportation mode to connect the route."
      >
        <form onSubmit={handleAddStopSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input
              label="Arrival Date"
              type="date"
              required
              value={addFormData.arrival_date}
              onChange={(e) => setAddFormData({ ...addFormData, arrival_date: e.target.value })}
            />
            <Input
              label="Departure Date"
              type="date"
              required
              value={addFormData.departure_date}
              onChange={(e) => setAddFormData({ ...addFormData, departure_date: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Select
              label="Transport Transition"
              value={addFormData.transport_mode}
              onChange={(e) => setAddFormData({ ...addFormData, transport_mode: e.target.value })}
              options={[
                { value: 'Flight', label: '✈️ Flight' },
                { value: 'Train', label: '🚆 Train' },
                { value: 'Drive', label: '🚗 Drive / Car' },
                { value: 'Bus', label: '🚌 Coach / Bus' },
                { value: 'Ferry', label: '⛴️ Ferry' }
              ]}
            />
            <Input
              label="Budget Allocation ($)"
              type="number"
              min="0"
              value={addFormData.budget_estimate}
              onChange={(e) => setAddFormData({ ...addFormData, budget_estimate: e.target.value })}
            />
          </div>

          <Textarea
            label="Stop Notes & Ideas (Optional)"
            placeholder="Accommodations, neighborhood highlights, bucket-list sights..."
            value={addFormData.notes}
            onChange={(e) => setAddFormData({ ...addFormData, notes: e.target.value })}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <Button variant="secondary" onClick={() => setSelectedCityForStop(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={Plus}>
              Confirm & Add Stop
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
