import React, { useState } from 'react';
import { 
  Trip 
} from '../types/index.ts';
import { 
  Plus, Search, Calendar, MapPin, DollarSign, 
  Trash2, Copy, Edit3, ArrowRight, Share2, 
  CheckCircle2, Sparkles, Filter, MoreHorizontal 
} from 'lucide-react';
import { useTrip } from '../context/TripContext.tsx';
import { api } from '../services/api.ts';

interface MyTripsPageProps {
  onNavigate: (tab: string) => void;
}

export const MyTripsPage: React.FC<MyTripsPageProps> = ({ onNavigate }) => {
  const { trips, activeTrip, setActiveTrip, loadTrips } = useTrip();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'upcoming' | 'active' | 'completed'>('all');
  const [deletingTripId, setDeletingTripId] = useState<string | null>(null);
  const [copiedTripId, setCopiedTripId] = useState<string | null>(null);

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.stops.some(s => s.cityName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;
    if (filterTab === 'all') return true;
    if (filterTab === 'active') return trip.id === activeTrip?.id;
    if (filterTab === 'upcoming') return new Date(trip.startDate) >= new Date();
    if (filterTab === 'completed') return new Date(trip.endDate) < new Date();
    return true;
  });

  const handleDeleteTrip = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.deleteTrip(id);
      await loadTrips();
      setDeletingTripId(null);
    } catch (err) {
      console.error('Delete trip error:', err);
    }
  };

  const handleDuplicateTrip = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const forked = await api.copyTrip(id, 'user_rahul');
      await loadTrips();
      setActiveTrip(forked);
      setCopiedTripId(id);
      setTimeout(() => setCopiedTripId(null), 2500);
    } catch (err) {
      console.error('Duplicate trip error:', err);
    }
  };

  const handleOpenTrip = (trip: Trip) => {
    setActiveTrip(trip);
    onNavigate('planner');
  };

  const handleOpenBuilder = (trip: Trip, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTrip(trip);
    onNavigate('builder');
  };

  return (
    <div className="space-y-6 py-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              My Trips & Itineraries
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
              {trips.length} Saved
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review, edit, and organize all your multi-city journeys in one place.
          </p>
        </div>

        <button
          onClick={() => onNavigate('create-trip')}
          className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Plan New Trip
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trips by destination city, title, or vibe..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 self-stretch sm:self-auto overflow-x-auto">
          {(['all', 'upcoming', 'active', 'completed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all ${
                filterTab === tab
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Trip Cards Grid */}
      {filteredTrips.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No journeys matching your filter</p>
          <p className="text-xs text-slate-500">Try changing your search query or generate a new trip with AI.</p>
          <button
            onClick={() => onNavigate('create-trip')}
            className="mt-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
          >
            Create Itinerary
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTrips.map(trip => {
            const isActive = activeTrip?.id === trip.id;
            return (
              <div
                key={trip.id}
                onClick={() => handleOpenTrip(trip)}
                className={`rounded-3xl border bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col cursor-pointer ${
                  isActive
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Card Top Cover Image */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={trip.coverImage}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-black/60 backdrop-blur-md text-white border border-white/20">
                      {trip.totalDays} Days
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-600/90 text-white">
                      {trip.stops.length} {trip.stops.length === 1 ? 'Stop' : 'Stops'}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1">
                    <button
                      title="Duplicate Trip"
                      onClick={(e) => handleDuplicateTrip(trip.id, e)}
                      className="p-2 rounded-xl bg-black/50 hover:bg-black/80 backdrop-blur-md text-white transition-all"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      title="Delete Trip"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingTripId(trip.id);
                      }}
                      className="p-2 rounded-xl bg-black/50 hover:bg-rose-600 backdrop-blur-md text-white transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-extrabold text-base line-clamp-1">
                      {trip.title}
                    </h3>
                    <p className="text-[11px] text-slate-200 mt-0.5 line-clamp-1">
                      {trip.stops.map(s => s.cityName).join(' → ')}
                    </p>
                  </div>
                </div>

                {/* Card Content & Details */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{trip.startDate} to {trip.endDate}</span>
                      </div>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {trip.health?.score || 94}/100 Health
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 font-medium">{trip.items.length} Activities Planned</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        {trip.currency}{trip.estimatedCost.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={(e) => handleOpenBuilder(trip, e)}
                      className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit Stops
                    </button>
                    <button
                      onClick={() => handleOpenTrip(trip)}
                      className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all"
                    >
                      <span>Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingTripId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Delete this itinerary?</h3>
              <p className="text-xs text-slate-500 mt-1">
                This action will remove the trip, stops, and assigned activities from your account.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setDeletingTripId(null)}
                className="py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={(e) => handleDeleteTrip(deletingTripId, e)}
                className="py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-500/25"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
