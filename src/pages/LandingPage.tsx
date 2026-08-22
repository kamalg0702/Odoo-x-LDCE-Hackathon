import React, { useState } from 'react';
import { 
  Sparkles, Compass, MapPin, ArrowRight, ShieldCheck, 
  CloudRain, AlertTriangle, Users, Bot, Zap, Globe, 
  Star, Heart, Flame, CheckCircle2 
} from 'lucide-react';
import { useTrip } from '../context/TripContext.tsx';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [heroPrompt, setHeroPrompt] = useState('I have ₹50,000, 7 days and love food, beaches and photography in Japan');
  const { trips, setActiveTrip, setIsRescueOpen, setIsPhotoToTripOpen, setIsAgentModeOpen } = useTrip();

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('create-trip');
  };

  const sampleTrips = [
    {
      title: 'Tokyo & Kyoto Cherry Blossom Explorer',
      days: 7,
      cost: '₹48,000',
      tag: 'Food & Temples',
      img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80',
      dnaMatch: '96% AI Match'
    },
    {
      title: 'Singapore Futuristic Gardens & Hawker Safari',
      days: 5,
      cost: '₹38,000',
      tag: 'Urban & Food',
      img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&auto=format&fit=crop&q=80',
      dnaMatch: '93% AI Match'
    },
    {
      title: 'Bali Emerald Paddies & Sunset Cliffs',
      days: 6,
      cost: '₹42,000',
      tag: 'Beaches & Nature',
      img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=80',
      dnaMatch: '95% AI Match'
    }
  ];

  return (
    <div className="space-y-16 py-8">
      
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white p-8 sm:p-12 border border-slate-800 shadow-2xl">
        
        {/* Glowing Background Mesh */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            The Adaptive AI Travel Operating System
          </div>

          {/* Display Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Plan less. <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
              Explore more.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            GlobeTrotter doesn't just create your itinerary. It continuously understands your Travel DNA, optimizes routes, predicts weather disruptions, and dynamically replans your journey in real-time.
          </p>

          {/* Natural Language Hero Prompt Box */}
          <form onSubmit={handleHeroSubmit} className="max-w-2xl mx-auto pt-2">
            <div className="p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl flex flex-col sm:flex-row items-center gap-2">
              <div className="flex items-center gap-3 px-3 w-full sm:w-auto flex-1">
                <Compass className="w-5 h-5 text-cyan-400 shrink-0" />
                <input
                  type="text"
                  value={heroPrompt}
                  onChange={(e) => setHeroPrompt(e.target.value)}
                  placeholder="Where do you want to go? Include budget, days & vibe..."
                  className="w-full bg-transparent text-xs sm:text-sm font-medium text-white placeholder-slate-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                id="hero-generate-trip-btn"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-blue-500/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
              >
                <span>Generate Trip</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Interactive World Route Path Demo */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-400">
            <span className="text-slate-200 font-bold">Popular Live AI Routes:</span>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              <span>Chennai</span>
              <span className="text-cyan-400">→</span>
              <span>Singapore</span>
              <span className="text-cyan-400">→</span>
              <span>Tokyo</span>
              <span className="text-cyan-400">→</span>
              <span>Kyoto</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4 Superpowers Feature Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Built for Real World Unpredictability
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Traditional itinerary tools break when it rains. GlobeTrotter AI adapts continuously.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Feature 1: Dynamic Replanning */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 hover:border-blue-500 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <CloudRain className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Dynamic Replanning
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Detects rain, flight delays, and closures. Instantly swaps outdoor activities with rainproof cultural gems and shows Before vs After diffs.
            </p>
          </div>

          {/* Feature 2: Trip Rescue */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 hover:border-amber-500 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              🚨 Trip Rescue
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Missed your bullet train or facing a hotel cancellation? AI rebooks transit, delays dinner reservations, and recovers your schedule in seconds.
            </p>
          </div>

          {/* Feature 3: Travel DNA */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 hover:border-purple-500 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Travel DNA Match
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              8-dimension behavioral radar profiling food explorer styles, photography spots, slow pacing, and budget preferences for 98% relevant plans.
            </p>
          </div>

          {/* Feature 4: Autonomous Agent Mode */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 hover:border-emerald-500 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Autonomous Agent Mode
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Self-driving itinerary optimization. Executes 5-phase calculations, transit scans, and database syncs with complete transparent traces.
            </p>
          </div>

        </div>
      </section>

      {/* Featured AI Sample Trips */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Featured Community Journeys
            </h2>
            <p className="text-xs text-slate-500">Curated & ready for 1-click customization</p>
          </div>

          <button
            onClick={() => onNavigate('discover')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            Explore All Catalog →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleTrips.map((trip, idx) => (
            <div
              key={idx}
              className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer"
              onClick={() => {
                if (trips.length > 0) setActiveTrip(trips[0]);
                onNavigate('planner');
              }}
            >
              <div className="relative aspect-16/10 overflow-hidden">
                <img
                  src={trip.img}
                  alt={trip.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold">
                  {trip.tag}
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-blue-600 text-white text-[10px] font-extrabold shadow-md">
                  {trip.dnaMatch}
                </div>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                  {trip.title}
                </h3>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-500">{trip.days} Days Itinerary</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">{trip.cost}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
