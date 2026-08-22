import React, { useState } from 'react';
import { 
  Sparkles, Compass, MapPin, Plus, AlertTriangle, 
  Camera, Bot, Calendar, ArrowRight, ShieldCheck, 
  TrendingUp, Dna, Heart, Share2, Layers 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useTrip } from '../context/TripContext.tsx';
import { 
  ResponsiveContainer, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { 
    trips, activeTrip, setActiveTrip, setIsRescueOpen, 
    setIsPhotoToTripOpen, setIsAgentModeOpen, setIsCopilotOpen 
  } = useTrip();
  const [quickPrompt, setQuickPrompt] = useState('');

  // Prepare radar chart data for user DNA
  const dna = user?.travelDNA || {
    foodExplorer: 90,
    beachLover: 70,
    adventure: 75,
    culture: 85,
    photography: 95,
    luxury: 60,
    budgetConscious: 80,
    slowTravel: 65
  };

  const radarData = [
    { subject: 'Food Explorer', A: dna.foodExplorer, fullMark: 100 },
    { subject: 'Photography', A: dna.photography, fullMark: 100 },
    { subject: 'Culture & History', A: dna.culture, fullMark: 100 },
    { subject: 'Budget Minded', A: dna.budgetConscious, fullMark: 100 },
    { subject: 'Slow Rest', A: dna.slowTravel, fullMark: 100 },
    { subject: 'Adventure', A: dna.adventure, fullMark: 100 }
  ];

  const handleCreatePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('create-trip');
  };

  return (
    <div className="space-y-8 py-6">
      
      {/* Personalized Welcome Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Good morning, {user?.name.split(' ')[0] || 'Traveler'} 👋
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
              🏆 {user?.level || 'Novice Explorer'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            GlobeTrotter AI has continuously monitored weather and transit along your active routes.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="dash-photo-trip-btn"
            onClick={() => setIsPhotoToTripOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-500/30 flex items-center gap-1.5 transition-all"
          >
            <Camera className="w-3.5 h-3.5 text-purple-500" />
            Photo Trip
          </button>

          <button
            id="dash-trip-rescue-btn"
            onClick={() => setIsRescueOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5 transition-all"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            Trip Rescue
          </button>

          <button
            id="dash-plan-trip-btn"
            onClick={() => onNavigate('create-trip')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Plan New Trip
          </button>
        </div>
      </div>

      {/* "Where are we going next?" Prompt Box */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white border border-blue-800/60 shadow-xl">
        <div className="max-w-3xl space-y-3">
          <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
            ✨ AI Itinerary Engine
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold">Where are we exploring next?</h2>
          <p className="text-xs text-slate-300">
            Tell AI your dream destination, budget, group size, and vibe (e.g. "5 days in Singapore with ₹45,000 focusing on hawker food").
          </p>

          <form onSubmit={handleCreatePromptSubmit} className="pt-2 flex items-center gap-2">
            <input
              type="text"
              value={quickPrompt}
              onChange={(e) => setQuickPrompt(e.target.value)}
              placeholder="e.g. 7 days in Tokyo & Kyoto with ₹50,000 for couples..."
              className="flex-1 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-extrabold text-xs sm:text-sm shadow-md shadow-cyan-500/30 hover:opacity-95 transition-all shrink-0"
            >
              Generate
            </button>
          </form>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-500">Active Trips</p>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{trips.length}</p>
          <p className="text-[11px] text-blue-500 font-semibold mt-0.5">1 Journey in progress</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-500">Total AI Savings</p>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">₹8,300</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Via pass & route optimization</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-500">Trip Health Index</p>
          <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
            {activeTrip?.health?.score || 94}/100
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">Optimal pace & low fatigue</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-500">Visited Cities</p>
          <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
            {user?.visitedCities?.length || 4}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Level: Novice Explorer</p>
        </div>
      </div>

      {/* Main Split: Upcoming Trips & Travel DNA Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: My Active Trips */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              My Saved & Active Journeys
            </h3>
            <button
              onClick={() => onNavigate('planner')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Open Active Workspace →
            </button>
          </div>

          <div className="space-y-4">
            {trips.map(trip => (
              <div
                key={trip.id}
                onClick={() => {
                  setActiveTrip(trip);
                  onNavigate('planner');
                }}
                className={`p-4 sm:p-5 rounded-3xl border bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all cursor-pointer ${
                  activeTrip?.id === trip.id
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <img
                      src={trip.coverImage}
                      alt={trip.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 border border-slate-100 dark:border-slate-800"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                          {trip.totalDays} Days
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300">
                          Health: {trip.health?.score}/100
                        </span>
                      </div>
                      <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                        {trip.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {trip.stops.map(s => s.cityName).join(' → ')} • {trip.startDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 gap-2 shrink-0">
                    <div className="text-right">
                      <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                        {trip.currency}{trip.estimatedCost.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-slate-400">Est. Total Cost</p>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm">
                      Open Workspace <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Travel DNA Radar Summary */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dna className="w-4 h-4 text-purple-500" />
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                My Travel DNA
              </h3>
            </div>
            <button
              onClick={() => onNavigate('travel-dna')}
              className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Retake Quiz
            </button>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#94a3b8" opacity={0.2} />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" opacity={0.3} />
                <Radar name="DNA" dataKey="A" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-900 dark:text-purple-200 space-y-1">
            <p className="font-bold flex items-center gap-1">
              <span>🌟 Primary Profile:</span> Food & Visual Explorer
            </p>
            <p className="text-[11px] opacity-90">
              High culinary appetite (90%) and photography focus (95%) with balanced afternoon rest pacing.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
