import React, { useState } from 'react';
import { 
  Trip, ItineraryItem, ActivityCategory, TimeSlot 
} from '../../types/index.ts';
import { 
  Clock, MapPin, Heart, Plus, Trash2, Edit2, 
  ChevronUp, ChevronDown, Lock, Unlock, Zap, 
  Sparkles, CloudRain, Sun, Cloud, AlertTriangle, 
  CheckCircle2, Coffee, ShieldCheck, Navigation, ThumbsUp 
} from 'lucide-react';
import { api } from '../../services/api.ts';

interface ItineraryTimelineProps {
  trip: Trip;
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  focusedItemId: string | null;
  setFocusedItemId: (id: string | null) => void;
  onTripUpdate: (trip: Trip) => void;
  onTriggerReplan: (disruptionType: string) => void;
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({
  trip,
  selectedDay,
  setSelectedDay,
  focusedItemId,
  setFocusedItemId,
  onTripUpdate,
  onTriggerReplan
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<ActivityCategory>('sightseeing');
  const [newItemSlot, setNewItemSlot] = useState<TimeSlot>('afternoon');
  const [newItemCost, setNewItemCost] = useState(500);
  const [newItemDuration, setNewItemDuration] = useState(90);

  // Group items by day
  const dayItems = trip.items.filter(i => i.dayNumber === selectedDay);
  
  // Sort items: morning -> afternoon -> evening
  const slotOrder: { [key in TimeSlot]: number } = { morning: 1, afternoon: 2, evening: 3 };
  const sortedItems = [...dayItems].sort((a, b) => {
    if (slotOrder[a.timeSlot] !== slotOrder[b.timeSlot]) {
      return slotOrder[a.timeSlot] - slotOrder[b.timeSlot];
    }
    return (a.startTime || '').localeCompare(b.startTime || '');
  });

  const currentWeather = trip.weather?.find(w => w.dayNumber === selectedDay) || {
    dayNumber: selectedDay,
    tempC: 23,
    condition: 'Sunny',
    description: 'Pleasant weather for exploring'
  };

  const handleVote = async (itemId: string) => {
    try {
      const updated = await api.voteActivity(trip.id, itemId);
      onTripUpdate(updated);
    } catch (err) {
      console.error('Vote error:', err);
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      const updated = await api.deleteActivity(trip.id, itemId);
      onTripUpdate(updated);
    } catch (err) {
      console.error('Delete item error:', err);
    }
  };

  const handleToggleLock = async (item: ItineraryItem) => {
    try {
      const updated = await api.updateActivity(trip.id, item.id, { isPinned: !item.isPinned });
      onTripUpdate(updated);
    } catch (err) {
      console.error('Toggle lock error:', err);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    try {
      const item: Partial<ItineraryItem> = {
        title: newItemTitle,
        category: newItemCategory,
        timeSlot: newItemSlot,
        dayNumber: selectedDay,
        cost: Number(newItemCost),
        durationMinutes: Number(newItemDuration),
        startTime: newItemSlot === 'morning' ? '09:30' : newItemSlot === 'afternoon' ? '14:00' : '19:00',
        endTime: newItemSlot === 'morning' ? '11:00' : newItemSlot === 'afternoon' ? '15:30' : '20:30',
        locationName: `${trip.stops[0]?.cityName || 'City Center'}`,
        description: 'Custom added experience.',
        aiMatchScore: 92,
        transportMode: 'walk',
        travelTimeFromPrevMinutes: 10,
        status: 'planned'
      };

      const updated = await api.addActivity(trip.id, item);
      onTripUpdate(updated);
      setIsAddModalOpen(false);
      setNewItemTitle('');
    } catch (err) {
      console.error('Add activity error:', err);
    }
  };

  const timeSlots: { slot: TimeSlot; label: string; icon: string; timeRange: string }[] = [
    { slot: 'morning', label: 'Morning', icon: '🌅', timeRange: '08:00 – 12:00' },
    { slot: 'afternoon', label: 'Afternoon', icon: '☀️', timeRange: '12:00 – 17:30' },
    { slot: 'evening', label: 'Evening', icon: '🌙', timeRange: '17:30 – 22:30' }
  ];

  return (
    <div className="space-y-4">
      
      {/* Trip Health & Fatigue Index Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white border border-slate-700 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-cyan-400 font-extrabold text-sm">
              {trip.health?.score || 92}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-200">Trip Health Index</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {trip.health?.fatigueRisk || 'Low'} Fatigue Risk
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Pacing: {trip.health?.paceDensity || 'Balanced'} • Rest Buffer Score: {trip.health?.restBufferScore || 90}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="simulate-storm-btn"
              onClick={() => onTriggerReplan('rain')}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Simulate sudden thunderstorm on Day 5"
            >
              <CloudRain className="w-3.5 h-3.5 text-amber-400" />
              Simulate Weather Storm
            </button>

            <button
              id="open-add-activity-btn"
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/25"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Activity
            </button>
          </div>
        </div>
      </div>

      {/* Days Tabs Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {Array.from({ length: trip.totalDays }).map((_, idx) => {
          const dayNum = idx + 1;
          const isSelected = selectedDay === dayNum;
          const dayWeather = trip.weather?.find(w => w.dayNumber === dayNum);
          return (
            <button
              key={dayNum}
              id={`timeline-day-tab-${dayNum}`}
              onClick={() => setSelectedDay(dayNum)}
              className={`px-4 py-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-0.5 shrink-0 transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/30 scale-102'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-slate-400'
              }`}
            >
              <span>Day {dayNum}</span>
              <span className={`text-[10px] font-normal flex items-center gap-1 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                {dayWeather?.condition === 'Heavy Storm' ? (
                  <span className="text-amber-400 font-bold flex items-center gap-0.5">⛈️ Storm</span>
                ) : (
                  <span>{dayWeather?.tempC || 24}°C</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Day Header & Weather Forecast Bar */}
      <div className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs ${
        currentWeather.isDisruptionRisk 
          ? 'bg-amber-500/10 border-amber-500/40 text-amber-900 dark:text-amber-200' 
          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
      }`}>
        <div className="flex items-center gap-2.5">
          <span className="text-lg">
            {currentWeather.condition === 'Heavy Storm' ? '⛈️' : currentWeather.condition === 'Rain' ? '🌧️' : '☀️'}
          </span>
          <div>
            <p className="font-extrabold text-sm">
              Day {selectedDay} Schedule ({currentWeather.condition}, {currentWeather.tempC}°C)
            </p>
            <p className="text-[11px] opacity-80">{currentWeather.description}</p>
          </div>
        </div>

        {currentWeather.isDisruptionRisk && (
          <button
            onClick={() => onTriggerReplan('rain')}
            className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-[11px] shadow-sm transition-all animate-pulse"
          >
            ⚡ Dynamic Replan Available
          </button>
        )}
      </div>

      {/* Time Slots & Activity Cards */}
      <div className="space-y-4">
        {timeSlots.map(ts => {
          const slotActivities = sortedItems.filter(i => i.timeSlot === ts.slot);
          return (
            <div key={ts.slot} className="space-y-2.5">
              {/* Slot Header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{ts.icon}</span>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {ts.label} <span className="text-[10px] font-normal text-slate-400">({ts.timeRange})</span>
                  </h4>
                </div>
                <span className="text-[10px] font-bold text-slate-400">
                  {slotActivities.length} {slotActivities.length === 1 ? 'activity' : 'activities'}
                </span>
              </div>

              {slotActivities.length === 0 ? (
                <div className="p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 bg-slate-50/50 dark:bg-slate-900/30">
                  Free exploration & relaxation pocket
                </div>
              ) : (
                slotActivities.map((item, idx) => {
                  const isFocused = focusedItemId === item.id;
                  const categoryBadgeColor = 
                    item.category === 'food' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20' :
                    item.category === 'culture' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' :
                    item.category === 'photography' ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20' :
                    item.category === 'nature' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                    'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';

                  return (
                    <div key={item.id} className="space-y-2">
                      {/* Transit Buffer between stops */}
                      {idx > 0 && item.travelTimeFromPrevMinutes && (
                        <div className="flex items-center gap-2 pl-4 py-1 text-[11px] text-slate-400 dark:text-slate-500">
                          <Navigation className="w-3 h-3 text-blue-500" />
                          <span>
                            {item.transportMode === 'subway' ? '🚇 Express Metro' : item.transportMode === 'train' ? '🚄 Shinkansen' : item.transportMode === 'taxi' ? '🚕 Taxi Transfer' : '🚶 Walking'} • {item.travelTimeFromPrevMinutes} mins
                          </span>
                          {item.transportCost ? (
                            <span className="font-semibold text-slate-500">({trip.currency}{item.transportCost})</span>
                          ) : null}
                        </div>
                      )}

                      {/* Main Activity Card */}
                      <div
                        id={`itinerary-item-${item.id}`}
                        onClick={() => setFocusedItemId(item.id)}
                        className={`group relative p-4 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                          isFocused 
                            ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/30' 
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          
                          {/* Image & Main Info */}
                          <div className="flex items-start gap-3.5 flex-1 min-w-0">
                            {item.imageUrl && (
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-slate-100 dark:border-slate-800"
                              />
                            )}

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full border ${categoryBadgeColor}`}>
                                  {item.category}
                                </span>
                                {item.aiMatchScore && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 flex items-center gap-0.5">
                                    <Sparkles className="w-2.5 h-2.5" />
                                    {item.aiMatchScore}% AI Match
                                  </span>
                                )}
                                {item.isIndoor && (
                                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300">
                                    ☔ Rainproof
                                  </span>
                                )}
                              </div>

                              <h5 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                                {item.title}
                              </h5>
                              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                                {item.description}
                              </p>

                              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                                <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                                  <Clock className="w-3 h-3 text-blue-500" />
                                  {item.startTime} – {item.endTime} ({item.durationMinutes}m)
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-400" />
                                  {item.locationName}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right Cost & Controls */}
                          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 gap-2 shrink-0">
                            <div className="text-right">
                              <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                                {trip.currency}{item.cost}
                              </p>
                              <p className="text-[10px] text-slate-400">per traveler</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1">
                              {/* Voting */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleVote(item.id);
                                }}
                                className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                                  item.userVoted
                                    ? 'bg-rose-500/10 text-rose-500 border border-rose-500/30'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-500'
                                }`}
                                title="Vote for this activity"
                              >
                                <Heart className={`w-3 h-3 ${item.userVoted ? 'fill-current' : ''}`} />
                                <span>{item.votesCount || 0}</span>
                              </button>

                              {/* Lock / Pin */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleLock(item);
                                }}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  item.isPinned
                                    ? 'bg-amber-500/15 text-amber-500'
                                    : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                                title={item.isPinned ? 'Activity Pinned (Protected from Auto-Replan)' : 'Pin Activity'}
                              >
                                {item.isPinned ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                              </button>

                              {/* Delete */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(item.id);
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title="Remove Activity"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                          </div>

                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          );
        })}
      </div>

      {/* Add Custom Activity Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
              Add Activity to Day {selectedDay}
            </h4>

            <form onSubmit={handleAddItem} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Activity Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Roppongi Hills Sunset Observatory"
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Time Slot</label>
                  <select
                    value={newItemSlot}
                    onChange={(e) => setNewItemSlot(e.target.value as TimeSlot)}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as ActivityCategory)}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                  >
                    <option value="sightseeing">Sightseeing</option>
                    <option value="food">Food & Dining</option>
                    <option value="culture">Culture</option>
                    <option value="photography">Photography</option>
                    <option value="nature">Nature</option>
                    <option value="shopping">Shopping</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Est. Cost ({trip.currency})</label>
                  <input
                    type="number"
                    value={newItemCost}
                    onChange={(e) => setNewItemCost(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Duration (mins)</label>
                  <input
                    type="number"
                    value={newItemDuration}
                    onChange={(e) => setNewItemDuration(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/25"
                >
                  Add Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
