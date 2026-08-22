import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Plus, MapPin, Calendar, DollarSign, TrendingUp, Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../core/hooks/useAuth';
import { useTrip } from '../../core/hooks/useTrip';
import { useCities } from '../../core/hooks/useCities';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { TripCard } from '../../components/shared/TripCard';
import { ShareModal } from '../../components/shared/ShareModal';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../core/utils/currency';
import { shareApi } from '../../core/api/share.api';
import { stopsApi } from '../../core/api/stops.api';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { trips, fetchTrips, isLoading } = useTrip();
  const { cities, fetchCities } = useCities();

  const [tripStopsMap, setTripStopsMap] = useState({});
  const [selectedShareTrip, setSelectedShareTrip] = useState(null);
  const [shareData, setShareData] = useState(null);

  useEffect(() => {
    fetchTrips().then(async (userTrips) => {
      if (userTrips && userTrips.length > 0) {
        // Fetch stops for each trip to render route lines
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
    fetchCities({ limit: 6 });
  }, [fetchTrips, fetchCities]);

  const handleShareClick = async (trip) => {
    setSelectedShareTrip(trip);
    try {
      const res = await shareApi.shareTrip(trip.id);
      setShareData(res.data);
    } catch {
      setShareData({ slug: trip.share_slug });
    }
  };

  // Metrics computation
  const totalTripsCount = trips.length;
  const totalBudgetAccumulated = trips.reduce((acc, t) => acc + (t.total_budget || 0), 0);
  const totalStopsCount = Object.values(tripStopsMap).reduce((acc, stops) => acc + stops.length, 0);

  return (
    <PageWrapper>
      {/* Hero Welcome Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          backgroundColor: '#FFFFFF',
          padding: '28px 32px',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--mist)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '32px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--traverse)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Travel Dashboard
            </span>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--mist-dark)' }} />
            <span style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>Overview</span>
          </div>
          <h1 className="font-display" style={{ fontSize: '30px', fontWeight: '800', color: 'var(--ink)', letterSpacing: '-0.5px' }}>
            Welcome, {user?.name || 'Explorer'}!
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginTop: '4px', maxWidth: '540px' }}>
            You have <strong style={{ color: 'var(--ink)' }}>{totalTripsCount}</strong> active journeys planned across <strong style={{ color: 'var(--ink)' }}>{totalStopsCount}</strong> global destinations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', position: 'relative', zIndex: 2 }}>
          <Button
            variant="primary"
            size="lg"
            icon={Plus}
            onClick={() => navigate('/trips/new')}
          >
            Plan New Journey
          </Button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}
      >
        <Card padding="md" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--traverse-light)', color: 'var(--traverse)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Compass size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Itineraries</div>
            <div className="font-data" style={{ fontSize: '24px', fontWeight: '800', color: 'var(--ink)', marginTop: '2px' }}>{totalTripsCount}</div>
          </div>
        </Card>

        <Card padding="md" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--terrain-light)', color: 'var(--terrain)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Destinations</div>
            <div className="font-data" style={{ fontSize: '24px', fontWeight: '800', color: 'var(--ink)', marginTop: '2px' }}>{totalStopsCount}</div>
          </div>
        </Card>

        <Card padding="md" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--gold-light)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Planned Budget</div>
            <div className="font-data" style={{ fontSize: '24px', fontWeight: '800', color: 'var(--ink)', marginTop: '2px' }}>{formatCurrency(totalBudgetAccumulated)}</div>
          </div>
        </Card>
      </div>

      {/* Recent Trips Section */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h2 className="font-display" style={{ fontSize: '22px', fontWeight: '800', color: 'var(--ink)' }}>
              Your Active Itineraries
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>Explore route maps and day-by-day stops.</p>
          </div>
          <button
            onClick={() => navigate('/trips')}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '600', color: 'var(--traverse)' }}
          >
            <span>View All Trips</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {trips.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {trips.slice(0, 3).map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                stops={tripStopsMap[trip.id] || []}
                onOpen={(id) => navigate(`/trips/${id}/build`)}
                onShare={handleShareClick}
              />
            ))}
          </div>
        ) : (
          <Card padding="lg" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <Compass size={36} style={{ color: 'var(--traverse)', margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--ink)' }}>No trips created yet</h3>
            <p style={{ fontSize: '13px', color: 'var(--ink-muted)', marginTop: '4px', maxWidth: '340px', margin: '4px auto 16px' }}>
              Begin your adventure by crafting a personalized multi-city itinerary.
            </p>
            <Button variant="primary" icon={Plus} onClick={() => navigate('/trips/new')}>
              Plan Your First Trip
            </Button>
          </Card>
        )}
      </div>

      {/* Recommended Global Destinations Showcase */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h2 className="font-display" style={{ fontSize: '22px', fontWeight: '800', color: 'var(--ink)' }}>
              Curated Destination Highlights
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>Inspiration from our global catalog of 50+ world destinations.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '18px' }}>
          {cities.slice(0, 4).map((city) => (
            <Card
              key={city.id}
              padding="none"
              interactive
              style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              onClick={() => navigate('/trips/new')}
            >
              <div
                style={{
                  height: '140px',
                  backgroundImage: `url(${city.image_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  padding: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}
              >
                <Badge variant="blue">{city.region}</Badge>
                <span className="font-data" style={{ fontSize: '12px', fontWeight: '700', backgroundColor: 'rgba(26, 26, 46, 0.8)', color: '#FFFFFF', padding: '3px 8px', borderRadius: 'var(--radius-full)' }}>
                  ★ {city.popularity_score}
                </span>
              </div>
              <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--ink)' }}>{city.name}</h4>
                  <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>{city.country}</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {city.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', borderTop: '1px solid var(--mist)', paddingTop: '8px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--ink-subtle)' }}>Avg Daily: <strong style={{ color: 'var(--ink)' }}>${city.avg_daily_cost}</strong></span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--traverse)' }}>Plan with {city.name} →</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Share Modal */}
      {selectedShareTrip && (
        <ShareModal
          isOpen={!!selectedShareTrip}
          onClose={() => setSelectedShareTrip(null)}
          trip={selectedShareTrip}
          shareData={shareData}
          onGenerateLink={() => handleShareClick(selectedShareTrip)}
        />
      )}
    </PageWrapper>
  );
}
