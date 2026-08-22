import React, { useState } from 'react';
import { 
  Trip, TripStop, ItineraryItem, ActivityCategory, TimeSlot 
} from '../types/index.ts';
import { 
  Plus, Trash2, ArrowUp, ArrowDown, MapPin, Calendar, 
  Clock, DollarSign, Sparkles, CheckCircle2, ChevronRight, 
  Edit2, Eye, Compass, Save, ArrowLeft 
} from 'lucide-react';
import { useTrip } from '../context/TripContext.tsx';
import { api } from '../services/api.ts';

interface ItineraryBuilderPageProps {
  onNavigate: (tab: string) => void;
}

export const ItineraryBuilderPage: React.FC<ItineraryBuilderPageProps> = ({ onNavigate }) => {
  const { activeTrip, setActiveTrip, updateActiveTripLocally, loadTrips } = useTrip();

  // Stop Add/Edit Modal
  const [isAddStopModalOpen, setIsAddStopModalOpen] = useState(false);
  const [editingStopId, setEditingStopId] = useState<string | null>(null);
  const [newCityName, setNewCityName] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [newArrivalDate, setNewArrivalDate] = useState('2026-09-10');
  const [newDepartureDate, setNewDepartureDate] = useState('2026-09-13');

  // Activity Add Modal
  const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState(false);
  const [selectedStopForActivity, setSelectedStopForActivity] = useState<TripStop | null>(null);
  const [activityTitle, setActivityTitle] = useState('');
  const [activityCategory, setActivityCategory] = useState<ActivityCategory>('sightseeing');
  const [activitySlot, setActivitySlot] = useState<TimeSlot>('morning');
  const [activityDay, setActivityDay] = useState(1);
  const [activityCost, setActivityCost] = useState(500);
  const [activityDuration, setActivityDuration] = useState(90);

  if (!activeTrip) {
    return (
      <div className="text-center py-20 space-y-4 max-w-md mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 mx-auto flex items-center justify-center">
          <Compass className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Trip Selected for Builder</h3>
        <p className="text-xs text-slate-500">Pick a trip to edit stops and assign day-by-day activities.</p>
        <button
          onClick={() => onNavigate('my-trips')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/25"
        >
          Browse My Trips
        </button>
      </div>
    );
  }

  const handleAddOrEditStop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityName.trim()) return;

    try {
      if (editingStopId) {
        // Edit existing stop
        const updated = await api.updateStop(activeTrip.id, editingStopId, {
          cityName: newCityName,
          country: newCountry || 'Global',
          arrivalDate: newArrivalDate,
          departureDate: newDepartureDate
        });
        updateActiveTripLocally(updated);
      } else {
        // Add new stop
        const newStop: Partial<TripStop> = {
          cityName: newCityName,
          country: newCountry || 'Global',
          arrivalDate: newArrivalDate,
          departureDate: newDepartureDate,
          order: activeTrip.stops.length + 1,
          lat: 35.6762,
          lng: 139.6503
        };
        const updated = await api.addStop(activeTrip.id, newStop);
        updateActiveTripLocally(updated);
      }

      setIsAddStopModalOpen(false);
      setEditingStopId(null);
      setNewCityName('');
      setNewCountry('');
    } catch (err) {
      console.error('Stop save error:', err);
    }
  };

  const handleDeleteStop = async (stopId: string) => {
    try {
      const updated = await api.deleteStop(activeTrip.id, stopId);
      updateActiveTripLocally(updated);
    } catch (err) {
      console.error('Delete stop error:', err);
    }
  };

  const handleMoveStop = async (index: number, direction: 'up' | 'down') => {
    const stops = [...activeTrip.stops];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= stops.length) return;

    const temp = stops[index];
    stops[index] = stops[targetIndex];
    stops[targetIndex] = temp;

    // Update order values
    stops.forEach((s, idx) => s.order = idx + 1);

    const updatedTrip = { ...activeTrip, stops };
    updateActiveTripLocally(updatedTrip);
    await api.updateTrip(activeTrip.id, { stops });
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityTitle.trim()) return;

    try {
      const newItem: Partial<ItineraryItem> = {
        title: activityTitle,
        category: activityCategory,
        timeSlot: activitySlot,
        dayNumber: activityDay,
        cost: Number(activityCost),
        durationMinutes: Number(activityDuration),
        startTime: activitySlot === 'morning' ? '09:30' : activitySlot === 'afternoon' ? '14:00' : '19:00',
        endTime: activitySlot === 'morning' ? '11:00' : activitySlot === 'afternoon' ? '15:30' : '20:30',
        locationName: `${selectedStopForActivity?.cityName || 'City Center'}, ${selectedStopForActivity?.country || ''}`,
        description: 'Interactive experience added via Itinerary Builder.',
        aiMatchScore: 92,
        status: 'planned'
      };

      const updated = await api.addActivity(activeTrip.id, newItem);
      updateActiveTripLocally(updated);
      setIsAddActivityModalOpen(false);
      setActivityTitle('');
    } catch (err) {
      console.error('Add activity error:', err);
    }
  };

  return (
    <div className="space-y-6 py-6 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('planner')}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Itinerary Builder
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
              {activeTrip.title}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Add and arrange destination stops, configure travel dates, and assign activities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingStopId(null);
              setNewCityName('');
              setNewCountry('');
              setIsAddStopModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add City Stop
          </button>
          <button
            onClick={() => onNavigate('planner')}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/25 flex items-center gap-1.5 transition-all"
          >
            <Eye className="w-4 h-4" />
            View Live Itinerary
          </button>
        </div>
      </div>

      {/* Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Ordered Stops & Activity Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Trip Stops & Timeline Order ({activeTrip.stops.length})
            </h3>
            <span className="text-xs text-slate-400 font-medium">Use arrows to reorder city stops</span>
          </div>

          <div className="space-y-4">
            {activeTrip.stops.map((stop, idx) => {
              const stopActivities = activeTrip.items.filter(
                i => (i.locationName || '').toLowerCase().includes(stop.cityName.toLowerCase())
              );

              return (
                <div
                  key={stop.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
                >
                  {/* Stop Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold text-sm flex items-center justify-center border border-blue-500/20">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                            {stop.cityName}, {stop.country}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            Stop #{idx + 1}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{stop.arrivalDate} → {stop.departureDate}</span>
                        </p>
                      </div>
                    </div>

                    {/* Reorder and Edit Actions */}
                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                      <button
                        title="Move Up"
                        disabled={idx === 0}
                        onClick={() => handleMoveStop(idx, 'up')}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-all text-slate-600 dark:text-slate-400"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Move Down"
                        disabled={idx === activeTrip.stops.length - 1}
                        onClick={() => handleMoveStop(idx, 'down')}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-all text-slate-600 dark:text-slate-400"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Edit Stop"
                        onClick={() => {
                          setEditingStopId(stop.id);
                          setNewCityName(stop.cityName);
                          setNewCountry(stop.country);
                          setNewArrivalDate(stop.arrivalDate);
                          setNewDepartureDate(stop.departureDate);
                          setIsAddStopModalOpen(true);
                        }}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-400"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Delete Stop"
                        onClick={() => handleDeleteStop(stop.id)}
                        className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Stop Assigned Activities */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                      <span>Assigned Experiences ({stopActivities.length})</span>
                      <button
                        onClick={() => {
                          setSelectedStopForActivity(stop);
                          setIsAddActivityModalOpen(true);
                        }}
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Assign Activity
                      </button>
                    </div>

                    {stopActivities.length === 0 ? (
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-400 text-center">
                        No activities assigned yet. Click "Assign Activity" to add sights, food tours, or transit.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {stopActivities.map(act => (
                          <div
                            key={act.id}
                            className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between gap-2"
                          >
                            <div className="min-w-0">
                              <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                {act.title}
                              </p>
                              <p className="text-[10px] text-slate-500 capitalize">
                                Day {act.dayNumber} • {act.timeSlot} • {activeTrip.currency}{act.cost}
                              </p>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold shrink-0">
                              {act.durationMinutes}m
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Trip Summary Card & Quick Presets */}
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Itinerary Summary
            </h3>
            
            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span>Total Journey Duration</span>
                <span className="font-bold text-slate-900 dark:text-white">{activeTrip.totalDays} Days</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span>Configured Stops</span>
                <span className="font-bold text-slate-900 dark:text-white">{activeTrip.stops.length} Cities</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span>Total Planned Items</span>
                <span className="font-bold text-slate-900 dark:text-white">{activeTrip.items.length} Activities</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span>Estimated Trip Budget</span>
                <span className="font-extrabold text-blue-600 dark:text-blue-400">
                  {activeTrip.currency}{activeTrip.estimatedCost.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-blue-700 dark:text-blue-300">
                <Sparkles className="w-4 h-4" />
                <span>AI Builder Advice</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Keep consecutive transit days buffered with at least 1 relaxed afternoon activity to preserve high Trip Health score (currently {activeTrip.health?.score}/100).
              </p>
            </div>

            <button
              onClick={() => onNavigate('discover')}
              className="w-full py-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-all"
            >
              <Compass className="w-3.5 h-3.5 text-blue-500" />
              <span>Browse Catalog to Add Spots</span>
            </button>
          </div>
        </div>

      </div>

      {/* Add / Edit Stop Modal */}
      {isAddStopModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              {editingStopId ? 'Edit Destination Stop' : 'Add Destination Stop'}
            </h3>
            
            <form onSubmit={handleAddOrEditStop} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">City Name</label>
                <input
                  type="text"
                  required
                  value={newCityName}
                  onChange={(e) => setNewCityName(e.target.value)}
                  placeholder="e.g. Kyoto, Osaka, Paris..."
                  className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Country</label>
                <input
                  type="text"
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  placeholder="e.g. Japan, France..."
                  className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Arrival Date</label>
                  <input
                    type="date"
                    required
                    value={newArrivalDate}
                    onChange={(e) => setNewArrivalDate(e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Departure Date</label>
                  <input
                    type="date"
                    required
                    value={newDepartureDate}
                    onChange={(e) => setNewDepartureDate(e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddStopModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/25"
                >
                  {editingStopId ? 'Update Stop' : 'Add Stop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Activity Modal */}
      {isAddActivityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Assign Activity to {selectedStopForActivity?.cityName}
            </h3>

            <form onSubmit={handleAddActivity} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Activity / Sight Title</label>
                <input
                  type="text"
                  required
                  value={activityTitle}
                  onChange={(e) => setActivityTitle(e.target.value)}
                  placeholder="e.g. Fushimi Inari Sunrise Hike..."
                  className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    value={activityCategory}
                    onChange={(e) => setActivityCategory(e.target.value as ActivityCategory)}
                    className="mt-1 w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                  >
                    <option value="sightseeing">Sightseeing</option>
                    <option value="food">Food & Dining</option>
                    <option value="culture">Culture & Temples</option>
                    <option value="adventure">Adventure</option>
                    <option value="nature">Nature</option>
                    <option value="relaxation">Relaxation</option>
                    <option value="transit">Transit</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Time Slot</label>
                  <select
                    value={activitySlot}
                    onChange={(e) => setActivitySlot(e.target.value as TimeSlot)}
                    className="mt-1 w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                  >
                    <option value="morning">Morning (09:00 - 12:00)</option>
                    <option value="afternoon">Afternoon (13:00 - 17:00)</option>
                    <option value="evening">Evening (18:00 - 22:00)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Day #</label>
                  <input
                    type="number"
                    min={1}
                    max={activeTrip.totalDays}
                    value={activityDay}
                    onChange={(e) => setActivityDay(Number(e.target.value))}
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Cost ({activeTrip.currency})</label>
                  <input
                    type="number"
                    min={0}
                    value={activityCost}
                    onChange={(e) => setActivityCost(Number(e.target.value))}
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Duration (min)</label>
                  <input
                    type="number"
                    min={15}
                    step={15}
                    value={activityDuration}
                    onChange={(e) => setActivityDuration(Number(e.target.value))}
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddActivityModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/25"
                >
                  Assign to Stop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
