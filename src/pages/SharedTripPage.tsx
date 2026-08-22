import React, { useState, useEffect } from 'react';
import { 
  Trip, ItineraryItem 
} from '../types/index.ts';
import { 
  Share2, Copy, Check, Sparkles, MapPin, Calendar, 
  DollarSign, Clock, Heart, Users, ArrowRight, 
  Download, Globe, ExternalLink, ShieldCheck, CheckCircle2 
} from 'lucide-react';
import { useTrip } from '../context/TripContext.tsx';
import { api } from '../services/api.ts';

interface SharedTripPageProps {
  onNavigate: (tab: string) => void;
  tripId?: string;
}

export const SharedTripPage: React.FC<SharedTripPageProps> = ({ onNavigate, tripId }) => {
  const { activeTrip, setActiveTrip, loadTrips } = useTrip();
  const [trip, setTrip] = useState<Trip | null>(activeTrip);
  const [copiedLink, setCopiedLink] = useState(false);
  const [forkSuccess, setForkSuccess] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'timeline' | 'budget'>('overview');

  useEffect(() => {
    async function fetchTrip() {
      if (tripId) {
        try {
          const res = await api.getTripById(tripId);
          setTrip(res);
        } catch (err) {
          console.error('Failed to load shared trip:', err);
        }
      } else if (activeTrip) {
        setTrip(activeTrip);
      }
    }
    fetchTrip();
  }, [tripId, activeTrip]);

  if (!trip) {
    return (
      <div className="text-center py-20 space-y-4 max-w-md mx-auto">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Trip not found</h3>
        <p className="text-xs text-slate-500">This itinerary may have been removed or set to private.</p>
        <button
          onClick={() => onNavigate('dashboard')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}?shareCode=${trip.shareCode || trip.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleCopyTripToAccount = async () => {
    try {
      const forked = await api.copyTrip(trip.id, 'user_rahul');
      await loadTrips();
      setActiveTrip(forked);
      setForkSuccess(true);
      setTimeout(() => {
        setForkSuccess(false);
        onNavigate('planner');
      }, 1500);
    } catch (err) {
      console.error('Copy trip error:', err);
    }
  };

  const dayItems = trip.items.filter(i => i.dayNumber === selectedDay);

  return (
    <div className="space-y-6 py-6 max-w-6xl mx-auto">
      
      {/* Public Banner Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white border border-blue-900/50 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-500/20 text-cyan-300 border border-blue-500/30 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                Public Shared Itinerary
              </span>
              <span className="text-xs text-slate-400">
                Code: <strong className="text-white font-mono">{trip.shareCode || 'GT-7729'}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="public-share-copy-btn"
                onClick={handleCopyLink}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold border border-white/20 flex items-center gap-1.5 transition-all"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Share URL'}</span>
              </button>

              <button
                id="public-copy-trip-btn"
                onClick={handleCopyTripToAccount}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/25 hover:opacity-95 transition-all"
              >
                {forkSuccess ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{forkSuccess ? 'Trip Cloned!' : 'Copy Trip (Fork)'}</span>
              </button>
            </div>
          </div>

          <div className="pt-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {trip.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl">
              {trip.description || `A curated ${trip.totalDays}-day journey exploring ${trip.stops.map(s => s.cityName).join(', ')}.`}
            </p>
          </div>

          {/* Key Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Duration</p>
              <p className="text-base font-extrabold mt-0.5">{trip.totalDays} Days</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Stops</p>
              <p className="text-base font-extrabold mt-0.5">{trip.stops.map(s => s.cityName).join(' → ')}</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Est. Cost</p>
              <p className="text-base font-extrabold mt-0.5 text-cyan-300">{trip.currency}{trip.estimatedCost.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Health Score</p>
              <p className="text-base font-extrabold mt-0.5 text-emerald-400">{trip.health?.score || 94}/100</p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Share Shortcuts */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-900 dark:text-white">Share with your travel crew:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out my trip itinerary for ${trip.title} on GlobeTrotter: ${shareUrl}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1"
          >
            WhatsApp
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out my trip plan for ${trip.title} on GlobeTrotter: `)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 text-xs font-bold border border-sky-500/30 flex items-center gap-1"
          >
            Twitter / X
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent(`Itinerary: ${trip.title}`)}&body=${encodeURIComponent(`Here is the trip itinerary: ${shareUrl}`)}`}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1"
          >
            Email
          </a>
          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </button>
        </div>
      </div>

      {/* Day-Wise Public Timeline View */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Daily Itinerary Breakdown
          </h3>

          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
            {Array.from({ length: trip.totalDays }, (_, i) => i + 1).map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedDay === day
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Day {day}
              </button>
            ))}
          </div>
        </div>

        {dayItems.length === 0 ? (
          <div className="p-8 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
            No activities scheduled for Day {selectedDay}.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dayItems.map(item => (
              <div
                key={item.id}
                className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-3.5"
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-slate-100 dark:border-slate-800"
                  />
                )}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 capitalize">
                      {item.category} • {item.timeSlot}
                    </span>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {trip.currency}{item.cost}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.startTime || '09:30'} ({item.durationMinutes}m)
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3" />
                      {item.locationName}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
