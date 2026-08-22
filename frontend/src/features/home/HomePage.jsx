import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Compass,
  MapPin,
  Calendar,
  DollarSign,
  Share2,
  Layers,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Globe2,
  TrendingUp,
  Sliders,
  Plane,
  Heart
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { useUIStore, THEMES } from '../../core/store/ui.store';

const CITIES_PREVIEW = [
  { name: 'Tokyo', country: 'Japan', cost: '₹14,500/day', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600' },
  { name: 'Paris', country: 'France', cost: '₹16,000/day', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600' },
  { name: 'Rome', country: 'Italy', cost: '₹13,500/day', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600' },
  { name: 'Bali', country: 'Indonesia', cost: '₹5,500/day', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600' }
];

export default function HomePage() {
  const navigate = useNavigate();
  const { theme, setTheme } = useUIStore();
  const [activeSimulatorCity, setActiveSimulatorCity] = useState(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--paper)', overflowX: 'hidden' }}>
      {/* Top Header */}
      <header className="glass-header" style={{ position: 'sticky', top: 0, zIndex: 100, height: '56px', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
              <Compass size={18} className="route-dash-animated" style={{ color: '#FFFFFF' }} />
            </div>
            <div>
              <span className="font-display" style={{ fontSize: '18px', fontWeight: '800', color: 'var(--ink)' }}>GlobeTrotter</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Quick Theme Switcher */}
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              style={{
                padding: '4px 8px',
                borderRadius: 'var(--radius-md)',
                fontSize: '12px',
                fontWeight: '600',
                border: '1px solid var(--card-border)',
                backgroundColor: 'var(--paper-card)',
                color: 'var(--ink)',
                cursor: 'pointer'
              }}
              title="Switch Visual Theme"
            >
              {THEMES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.icon} {t.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => navigate('/auth/login')}
              style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ink)', padding: '6px 12px' }}
            >
              Sign In
            </button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => navigate('/auth/register')}
            >
              Start Free
            </Button>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section style={{ position: 'relative', padding: '70px 20px 60px', overflow: 'hidden' }} className="atlas-bg-pattern">
        <motion.div
          style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--traverse-light)', border: '1px solid var(--traverse-ring)', color: 'var(--traverse)', padding: '4px 14px', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: '700', marginBottom: '20px' }}>
            <Sparkles size={14} />
            <span>THE MULTI-CITY ATLAS ENGINE</span>
          </motion.div>

          <motion.h1
            className="font-display"
            variants={itemVariants}
            style={{ fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: '800', lineHeight: '1.15', color: 'var(--ink)', letterSpacing: '-1px', maxWidth: '820px', margin: '0 auto' }}
          >
            Design Multi-City Journeys with <span style={{ color: 'var(--traverse)' }}>Unmatched Precision</span>.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            style={{ fontSize: '16px', color: 'var(--ink-muted)', maxWidth: '620px', margin: '18px auto 32px', lineHeight: '1.6' }}
          >
            Plan complex routes, drag-to-reorder destination stops, calculate automatic INR budgets, and share interactive live blueprints with zero friction.
          </motion.p>

          <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Button
              size="lg"
              variant="primary"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate('/auth/register')}
            >
              Build Your Itinerary Free
            </Button>
            <Button
              size="lg"
              variant="secondary"
              icon={Compass}
              onClick={() => navigate('/auth/login')}
            >
              Try Demo Accounts
            </Button>
          </motion.div>

          {/* Interactive Route Blueprint Preview Card */}
          <motion.div
            variants={itemVariants}
            style={{
              marginTop: '48px',
              backgroundColor: 'var(--paper-card)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
              border: '1px solid var(--card-border)',
              boxShadow: 'var(--shadow-xl)',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <Badge variant="blue">LIVE BLUEPRINT SIMULATION</Badge>
                <h3 className="font-display" style={{ fontSize: '20px', fontWeight: '800', color: 'var(--ink)', marginTop: '4px' }}>
                  Grand Eurasian Odyssey (14 Days)
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="font-data" style={{ fontSize: '14px', fontWeight: '700', color: 'var(--terrain)', backgroundColor: 'var(--terrain-light)', padding: '4px 10px', borderRadius: 'var(--radius-md)' }}>
                  Total: ₹2,45,000
                </span>
              </div>
            </div>

            {/* Interactive SVG Path with Animation */}
            <div style={{ height: '80px', margin: '10px 0 20px', position: 'relative' }}>
              <svg viewBox="0 0 400 60" style={{ width: '100%', height: '100%' }}>
                <path
                  d="M 40 30 C 120 10, 180 50, 240 20 C 300 -10, 340 45, 370 30"
                  fill="none"
                  stroke="var(--traverse)"
                  strokeWidth="2.5"
                  strokeDasharray="6 3"
                  className="route-dash-animated"
                />
                {[
                  { x: 40, y: 30, name: 'Paris', index: 0 },
                  { x: 150, y: 36, name: 'Rome', index: 1 },
                  { x: 260, y: 15, name: 'Dubai', index: 2 },
                  { x: 370, y: 30, name: 'Tokyo', index: 3 }
                ].map((pt) => (
                  <g
                    key={pt.name}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setActiveSimulatorCity(pt.index)}
                  >
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={activeSimulatorCity === pt.index ? '8' : '5'}
                      fill={activeSimulatorCity === pt.index ? 'var(--traverse)' : '#FFFFFF'}
                      stroke="var(--traverse)"
                      strokeWidth="2"
                    />
                    <text
                      x={pt.x}
                      y={pt.y > 30 ? pt.y + 16 : pt.y - 10}
                      textAnchor="middle"
                      fill="var(--ink)"
                      fontSize="9"
                      fontWeight="700"
                    >
                      {pt.name}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {CITIES_PREVIEW.map((c, idx) => (
                <div
                  key={c.name}
                  onClick={() => setActiveSimulatorCity(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${activeSimulatorCity === idx ? 'var(--traverse)' : 'var(--card-border)'}`,
                    backgroundColor: activeSimulatorCity === idx ? 'var(--traverse-light)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <img src={c.image} alt={c.name} style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--ink)' }}>{idx + 1}. {c.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>Avg {c.cost}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Showcase Grid */}
      <section style={{ padding: '60px 20px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <Badge variant="blue">POWERFUL CAPABILITIES</Badge>
          <h2 className="font-display" style={{ fontSize: '32px', fontWeight: '800', color: 'var(--ink)', marginTop: '8px' }}>
            Built for Serious Global Travelers
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginTop: '4px' }}>
            Everything you need from the first spark of inspiration to on-the-road execution.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <Card padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--traverse-light)', color: 'var(--traverse)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={22} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--ink)' }}>Drag-and-Drop Itinerary Builder</h3>
            <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: '1.5' }}>
              Seamlessly swap stops, reorder destination sequences with fluid spring physics, and auto-calculate stay durations.
            </p>
          </Card>

          <Card padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--terrain-light)', color: 'var(--terrain)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={22} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--ink)' }}>Automated INR Budgeting</h3>
            <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: '1.5' }}>
              Live expense summation in Rupees (₹) comparing transport, stays, meals, and tickets with Recharts category distributions.
            </p>
          </Card>

          <Card padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--gold-light)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Share2 size={22} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--ink)' }}>Zero-Auth Public Sharing</h3>
            <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: '1.5' }}>
              Generate unique shareable URLs so family and travel companions can view your complete itinerary without logging in.
            </p>
          </Card>

          <Card padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* FIXED: Replaced hardcoded purple with theme-adaptive traverse-light and traverse tokens */}
            <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--traverse-light)', color: 'var(--traverse)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe2 size={22} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--ink)' }}>50+ Preloaded World Cities</h3>
            <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: '1.5' }}>
              Comprehensive destination catalog indexed by regional costs, coordinates, popularity, and curated activity ideas.
            </p>
          </Card>

          <Card padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--sand)', color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={22} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--ink)' }}>Day-by-Day Timeline Gantt</h3>
            <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: '1.5' }}>
              Visual chronological schedule matching each travel day to destination transitions and timed activity reservations.
            </p>
          </Card>

          <Card padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--traverse-light)', color: 'var(--traverse)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sliders size={22} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--ink)' }}>6 Dynamic Aesthetic Themes</h3>
            <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: '1.5' }}>
              Switch seamlessly between Atlas Classic, Midnight Dark, Emerald Oasis, Nordic Frost, Sunset Terracotta, and Cyberpunk.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section style={{ padding: '60px 20px 80px', maxWidth: '1000px', margin: '0 auto' }}>
        {/* FIXED: Use theme cta variables to prevent white-on-white text in dark themes */}
        <div
          style={{
            backgroundColor: 'var(--cta-bg)',
            border: '1px solid var(--cta-border)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            padding: '48px 36px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-xl)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Compass size={40} className="route-dash-animated" style={{ color: 'var(--traverse)', margin: '0 auto 16px' }} />
          <h2 className="font-display" style={{ fontSize: '32px', fontWeight: '800', color: '#FFFFFF' }}>
            Ready to Plan Your Next Grand Adventure?
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.8)', maxWidth: '520px', margin: '10px auto 28px' }}>
            Join thousands of travelers using GlobeTrotter to map multi-city routes and stay within budget.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/auth/register')}
            >
              Get Started for Free
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/auth/login')}
            >
              Sign In with Google
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
