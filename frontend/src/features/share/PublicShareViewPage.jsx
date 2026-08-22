import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Compass, Calendar, MapPin, Clock, Star, ArrowRight, Share2, Globe, Heart } from 'lucide-react';
import { shareApi } from '../../core/api/share.api';
import { RouteMapSvg } from '../../components/shared/RouteMapSvg';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatDateRange, calculateDays, formatDate } from '../../core/utils/date';
import { formatCurrency } from '../../core/utils/currency';

export default function PublicShareViewPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPublicTrip() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await shareApi.getPublicTrip(slug);
        setTrip(res.data.trip);
      } catch (err) {
        setError(err.error || 'This shared journey could not be found or has expired.');
      } finally {
        setIsLoading(false);
      }
    }
    if (slug) {
      loadPublicTrip();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--paper)' }}>
        <div style={{ textAlign: 'center' }}>
          <Compass size={48} className="route-dash-animated" style={{ color: 'var(--traverse)', margin: '0 auto 16px' }} />
          <h3 className="font-display" style={{ fontSize: '20px', fontWeight: '700', color: 'var(--ink)' }}>Loading Journey Blueprint...</h3>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'var(--paper)' }}>
        <Card padding="lg" style={{ textAlign: 'center', maxWidth: '480px' }}>
          <Globe size={40} style={{ color: 'var(--alert)', margin: '0 auto 12px' }} />
          <h2 className="font-display" style={{ fontSize: '22px', fontWeight: '800', color: 'var(--ink)' }}>Journey Not Found</h2>
          <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginTop: '6px', marginBottom: '20px' }}>{error}</p>
          <Button variant="primary" onClick={() => navigate('/auth/login')}>Explore GlobeTrotter</Button>
        </Card>
      </div>
    );
  }

  const days = calculateDays(trip.start_date, trip.end_date);
  const stops = trip.stops || [];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--paper)' }}>
      {/* Top Navbar */}
      <header className="glass-header" style={{ height: '60px', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
              <Compass size={18} />
            </div>
            <span className="font-display" style={{ fontSize: '18px', fontWeight: '800', color: 'var(--ink)' }}>GlobeTrotter</span>
          </div>

          <Button variant="primary" size="sm" onClick={() => navigate('/auth/register')}>
            Plan Your Own Trip
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px 64px' }} className="animate-fade-in">
        {/* Hero Card */}
        <div
          style={{
            position: 'relative',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            backgroundColor: 'var(--ink)',
            color: '#FFFFFF',
            minHeight: '260px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '36px',
            boxShadow: 'var(--shadow-lg)',
            backgroundImage: `linear-gradient(to top, rgba(26, 26, 46, 0.92) 0%, rgba(26, 26, 46, 0.3) 100%), url(${trip.cover_photo_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            marginBottom: '28px'
          }}
        >
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Badge variant="gold">
                PUBLIC ITINERARY
              </Badge>
              <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} />
                {formatDateRange(trip.start_date, trip.end_date)} ({days} days)
              </span>
            </div>

            <h1 className="font-display" style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-0.5px', color: '#FFFFFF', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              {trip.name}
            </h1>

            {trip.description && (
              <p style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.9)', maxWidth: '700px', marginTop: '8px', lineHeight: '1.5' }}>
                {trip.description}
              </p>
            )}

            {/* Author Credit */}
            {trip.author && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.2)', paddingTop: '12px' }}>
                <img
                  src={trip.author.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=traveler'}
                  alt={trip.author.name}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #FFFFFF' }}
                />
                <div>
                  <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.75)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Curated by</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>{trip.author.name}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Route Map Preview */}
        {/* FIXED: hardcoded white → var(--paper-card) */}
        <Card padding="md" style={{ marginBottom: '32px', backgroundColor: 'var(--paper-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Compass size={18} style={{ color: 'var(--traverse)' }} />
            <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--ink)' }}>
              Expedition Map Route ({stops.length} Stops)
            </span>
          </div>
          <RouteMapSvg stops={stops} height={100} animated={true} />
        </Card>

        {/* Stops & Sights Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {stops.map((stop, index) => {
            const stopDays = calculateDays(stop.arrival_date, stop.departure_date);
            const acts = stop.activities || [];

            return (
              <Card key={stop.id} padding="none" style={{ overflow: 'hidden' }}>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Badge variant="blue">Stop #{index + 1}</Badge>
                    <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.85)' }}>
                      Transit via {stop.transport_mode || 'Flight'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display" style={{ fontSize: '24px', fontWeight: '800' }}>
                      {stop.city?.name}, {stop.city?.country}
                    </h3>
                    <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)', marginTop: '2px' }}>
                      {formatDateRange(stop.arrival_date, stop.departure_date)} ({stopDays} days)
                    </div>
                  </div>
                </div>

                <div style={{ padding: '20px 24px' }}>
                  {stop.notes && (
                    <p style={{ fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '16px', fontStyle: 'italic' }}>
                      "{stop.notes}"
                    </p>
                  )}

                  {acts.length > 0 ? (
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
                        Scheduled Sights & Activities ({acts.length})
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                        {acts.map((act) => (
                          <div
                            key={act.id}
                            style={{
                              padding: '12px',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid var(--mist)',
                              backgroundColor: 'var(--paper)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Badge variant="blue" size="sm">{act.activity?.category || 'Sight'}</Badge>
                              {act.scheduled_time && (
                                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--traverse)' }}>
                                  @{act.scheduled_time}
                                </span>
                              )}
                            </div>
                            <h5 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--ink)' }}>
                              {act.activity?.name || 'Activity'}
                            </h5>
                            {act.activity?.description && (
                              <p style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: '1.4' }}>
                                {act.activity.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
                      Free days and cultural exploration in {stop.city?.name}.
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA Card */}
        {/* FIXED: hardcoded ink -> var(--cta-bg) & var(--cta-border) */}
        <Card
          padding="lg"
          style={{
            marginTop: '48px',
            textAlign: 'center',
            backgroundColor: 'var(--cta-bg)',
            color: '#FFFFFF',
            border: '1px solid var(--cta-border)',
            boxShadow: 'var(--shadow-xl)'
          }}
        >
          <Compass size={36} style={{ color: 'var(--traverse)', margin: '0 auto 12px' }} />
          <h2 className="font-display" style={{ fontSize: '24px', fontWeight: '800', color: '#FFFFFF' }}>
            Inspired by this Journey?
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', maxWidth: '460px', margin: '6px auto 20px' }}>
            Build your own personalized multi-city itineraries, drag-and-drop stops, and calculate accurate travel budgets with GlobeTrotter.
          </p>
          <Button
            variant="primary"
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => navigate('/auth/register')}
          >
            Create Your Free Account
          </Button>
        </Card>
      </main>
    </div>
  );
}
