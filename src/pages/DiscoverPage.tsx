import React, { useState, useEffect } from 'react';
import { 
  Compass, Search, MapPin, Sparkles, Filter, 
  Star, DollarSign, Plus, ArrowRight, Heart, 
  Calendar, Clock, Check, Eye, X, Globe, Layers, 
  Tag, ShieldCheck, CheckCircle2 
} from 'lucide-react';
import { api } from '../services/api.ts';
import { Destination, ActivityCatalogItem } from '../types/index.ts';
import { useTrip } from '../context/TripContext.tsx';

interface DiscoverPageProps {
  onNavigate: (tab: string) => void;
  defaultTab?: 'destinations' | 'activities';
}

export const DiscoverPage: React.FC<DiscoverPageProps> = ({ onNavigate, defaultTab = 'destinations' }) => {
  const { activeTrip, updateActiveTripLocally } = useTrip();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [activities, setActivities] = useState<ActivityCatalogItem[]>([]);
  const [activeTab, setActiveTab] = useState<'destinations' | 'activities'>(defaultTab);
  
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedCostIndex, setSelectedCostIndex] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('all');
  const [maxCostFilter, setMaxCostFilter] = useState<number>(15000);
  const [sortBy, setSortBy] = useState<'popularity' | 'match' | 'cost_asc' | 'cost_desc'>('popularity');
  
  // Modals & Feedback
  const [addedActivityId, setAddedActivityId] = useState<string | null>(null);
  const [selectedDestinationModal, setSelectedDestinationModal] = useState<Destination | null>(null);
  const [selectedActivityModal, setSelectedActivityModal] = useState<ActivityCatalogItem | null>(null);
  const [targetDayForAdd, setTargetDayForAdd] = useState<number>(1);
  const [addingToDayActivity, setAddingToDayActivity] = useState<ActivityCatalogItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const [destData, actData] = await Promise.all([
          api.getDestinations(),
          api.getActivities()
        ]);
        setDestinations(destData);
        setActivities(actData);
      } catch (err) {
        console.error('Catalog load error:', err);
      }
    }
    loadCatalog();
  }, []);

  const regions = ['all', 'East Asia', 'Southeast Asia', 'Europe', 'South Asia', 'Americas'];
  const categories = ['all', 'sightseeing', 'food', 'culture', 'photography', 'nature', 'adventure', 'shopping'];
  const costIndices = ['all', '$', '$$', '$$$', '$$$$'];

  // Filtering Destinations (Screen 7: City Search)
  const filteredDestinations = destinations.filter(d => {
    const matchesSearch = 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      d.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.tags && d.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesRegion = selectedRegion === 'all' || d.region === selectedRegion;
    const matchesCost = selectedCostIndex === 'all' || d.costIndex === selectedCostIndex;
    return matchesSearch && matchesRegion && matchesCost;
  }).sort((a, b) => {
    if (sortBy === 'popularity') return (b.popularityScore || 0) - (a.popularityScore || 0);
    if (sortBy === 'match') return (b.aiMatchScore || 0) - (a.aiMatchScore || 0);
    if (sortBy === 'cost_asc') return (a.avgDailyCost || a.averageDailyCost || 0) - (b.avgDailyCost || b.averageDailyCost || 0);
    if (sortBy === 'cost_desc') return (b.avgDailyCost || b.averageDailyCost || 0) - (a.avgDailyCost || a.averageDailyCost || 0);
    return 0;
  });

  // Filtering Activities (Screen 8: Activity Search)
  const filteredActivities = activities.filter(a => {
    const actCity = a.city || a.destination || '';
    const matchesSearch = 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      actCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.category && a.category.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory;
    const matchesCity = selectedCityFilter === 'all' || actCity.toLowerCase() === selectedCityFilter.toLowerCase();
    const matchesCost = a.cost <= maxCostFilter;
    return matchesSearch && matchesCategory && matchesCity && matchesCost;
  }).sort((a, b) => {
    if (sortBy === 'match') return (b.aiMatchScore || 0) - (a.aiMatchScore || 0);
    if (sortBy === 'cost_asc') return a.cost - b.cost;
    if (sortBy === 'cost_desc') return b.cost - a.cost;
    return 0;
  });

  // Get distinct cities from activities
  const availableCities = Array.from(new Set(activities.map(a => a.city || a.destination || 'Tokyo'))).filter(Boolean);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddDestinationAsStop = async (dest: Destination) => {
    if (!activeTrip) {
      onNavigate('create-trip');
      return;
    }
    try {
      const updated = await api.addStop(activeTrip.id, {
        cityName: dest.name,
        country: dest.country,
        arrivalDate: activeTrip.startDate,
        departureDate: activeTrip.endDate,
        order: activeTrip.stops.length + 1,
        lat: dest.lat || 35.6762,
        lng: dest.lng || 139.6503
      });
      updateActiveTripLocally(updated);
      showToast(`Added ${dest.name}, ${dest.country} to "${activeTrip.title}"!`);
      setSelectedDestinationModal(null);
    } catch (err) {
      console.error('Add stop error:', err);
    }
  };

  const handleConfirmAddActivity = async () => {
    if (!activeTrip || !addingToDayActivity) return;
    const act = addingToDayActivity;
    try {
      const updated = await api.addActivity(activeTrip.id, {
        title: act.title,
        category: act.category,
        timeSlot: 'afternoon',
        dayNumber: targetDayForAdd,
        cost: act.cost,
        durationMinutes: act.durationMinutes,
        locationName: `${act.city || act.destination || 'Tokyo'}, ${act.country}`,
        imageUrl: act.imageUrl,
        description: act.description,
        aiMatchScore: act.aiMatchScore,
        status: 'planned'
      });
      updateActiveTripLocally(updated);
      setAddedActivityId(act.id);
      showToast(`Added "${act.title}" to Day ${targetDayForAdd}!`);
      setAddingToDayActivity(null);
      setTimeout(() => setAddedActivityId(null), 2500);
    } catch (err) {
      console.error('Add activity error:', err);
    }
  };

  return (
    <div className="space-y-6 py-6 max-w-7xl mx-auto">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900 text-white border border-slate-700 shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Screen 7 / Screen 8 Tab Toggle */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {activeTab === 'destinations' ? 'City Search & Exploration' : 'Activity & Experience Catalog'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
              {activeTab === 'destinations' ? 'Screen 7' : 'Screen 8'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {activeTab === 'destinations' 
              ? 'Filter and add global destinations with live cost indices, popularity ratings, and Travel DNA scores.' 
              : 'Browse curated attractions, walking tours, culinary experiences, and add them directly to your itinerary.'}
          </p>
        </div>

        {/* Master Screen Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
          <button
            id="tab-destinations-btn"
            onClick={() => { setActiveTab('destinations'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'destinations'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-blue-500" />
            <span>City Search (Screen 7)</span>
          </button>

          <button
            id="tab-activities-btn"
            onClick={() => { setActiveTab('activities'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'activities'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span>Activity Search (Screen 8)</span>
          </button>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        
        {/* Main Search Input & Sorter */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="discover-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === 'destinations' ? 'Search cities, countries, tags (e.g. Tokyo, Paris, Temples, Beaches)...' : 'Search activities, culinary tours, photography walks, landmarks...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <span className="text-xs font-bold text-slate-400 whitespace-nowrap">Sort:</span>
            <select
              id="discover-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="popularity">🔥 Highest Popularity</option>
              <option value="match">🧬 Highest Travel DNA Match</option>
              <option value="cost_asc">💵 Daily Cost: Low to High</option>
              <option value="cost_desc">💎 Daily Cost: High to Low</option>
            </select>
          </div>
        </div>

        {/* Secondary Filter Badges */}
        {activeTab === 'destinations' ? (
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            {/* Region Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
                <Globe className="w-3 h-3" /> Region:
              </span>
              {regions.map(r => (
                <button
                  key={r}
                  onClick={() => setSelectedRegion(r)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap capitalize transition-all ${
                    selectedRegion === r
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {r === 'all' ? 'All Regions' : r}
                </button>
              ))}
            </div>

            {/* Cost Index Filter */}
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
                <DollarSign className="w-3 h-3" /> Cost Index:
              </span>
              {costIndices.map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedCostIndex(c)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                    selectedCostIndex === c
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {c === 'all' ? 'All' : c}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            {/* City Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> City:
              </span>
              <select
                value={selectedCityFilter}
                onChange={(e) => setSelectedCityFilter(e.target.value)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                <option value="all">All Cities</option>
                {availableCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Category Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap capitalize transition-all ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
            </div>

            {/* Max Cost Filter */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-[11px] font-bold text-slate-400">Max: ₹{maxCostFilter.toLocaleString()}</span>
              <input
                type="range"
                min={0}
                max={15000}
                step={500}
                value={maxCostFilter}
                onChange={(e) => setMaxCostFilter(Number(e.target.value))}
                className="w-24 accent-purple-600"
              />
            </div>
          </div>
        )}
      </div>

      {/* SCREEN 7: CITY SEARCH DESTINATIONS GRID */}
      {activeTab === 'destinations' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500">
              Showing {filteredDestinations.length} matching destinations
            </span>
            {activeTrip && (
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                Active Trip: <strong>{activeTrip.title}</strong>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map(dest => {
              const dailyCost = dest.avgDailyCost || dest.averageDailyCost || 6500;
              return (
                <div
                  key={dest.id}
                  className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Cover Photo & Badges */}
                    <div className="relative aspect-16/10 overflow-hidden">
                      <img
                        src={dest.imageUrl || dest.coverImage}
                        alt={dest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        <span>{dest.country}</span>
                        {dest.region && <span className="text-slate-400">• {dest.region}</span>}
                      </div>

                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-blue-600 text-white text-[10px] font-extrabold shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-cyan-300" />
                        {dest.aiMatchScore || 95}% Match
                      </div>

                      <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[11px] font-extrabold">
                        {dest.costIndex || '$$$'} • Score: {dest.popularityScore || 96}/100
                      </div>
                    </div>

                    {/* Meta & Info Body */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                          {dest.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {dest.description || dest.tagline}
                        </p>
                      </div>

                      {/* Best Time to Visit */}
                      {dest.bestTimeToVisit && (
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" />
                          <span>Best Time: <strong>{dest.bestTimeToVisit}</strong></span>
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {dest.tags?.slice(0, 4).map((t, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-5 pt-0">
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                          ₹{dailyCost.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-slate-400">avg. daily cost</p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedDestinationModal(dest)}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-all"
                          title="Quick View Destination Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleAddDestinationAsStop(dest)}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add to Trip</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SCREEN 8: ACTIVITY SEARCH GRID */}
      {activeTab === 'activities' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500">
              Showing {filteredActivities.length} matching experiences
            </span>
            {activeTrip && (
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Active Trip: <strong>{activeTrip.title}</strong>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map(act => (
              <div
                key={act.id}
                className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo & Category Badges */}
                  <div className="relative aspect-16/10 overflow-hidden">
                    <img
                      src={act.imageUrl}
                      alt={act.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold uppercase">
                      {act.category}
                    </div>
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-purple-600 text-white text-[10px] font-extrabold shadow-md">
                      {act.aiMatchScore}% DNA Match
                    </div>
                  </div>

                  {/* Activity Details */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
                      <MapPin className="w-3 h-3 text-blue-500" />
                      <span>{act.city || act.destination || 'Tokyo'} • {act.durationMinutes} mins</span>
                    </div>

                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                      {act.title}
                    </h3>
                    
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {act.description}
                    </p>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                        ₹{act.cost.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-slate-400">per traveler</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedActivityModal(act)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-all"
                        title="View Activity Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (!activeTrip) {
                            onNavigate('create-trip');
                          } else {
                            setAddingToDayActivity(act);
                          }
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-xs ${
                          addedActivityId === act.id
                            ? 'bg-emerald-500 text-white'
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                        }`}
                      >
                        <Plus className="w-3 h-3" />
                        {addedActivityId === act.id ? 'Added!' : 'Add to Day'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUICK VIEW DESTINATION MODAL (Screen 7 Detail) */}
      {selectedDestinationModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="relative aspect-video">
              <img
                src={selectedDestinationModal.imageUrl || selectedDestinationModal.coverImage}
                alt={selectedDestinationModal.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedDestinationModal(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-950/70 text-white hover:bg-slate-950"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold">
                {selectedDestinationModal.country} • {selectedDestinationModal.region}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {selectedDestinationModal.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {selectedDestinationModal.description || selectedDestinationModal.tagline}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Cost Index</span>
                  <strong className="text-slate-900 dark:text-white">{selectedDestinationModal.costIndex}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Avg. Daily Budget</span>
                  <strong className="text-emerald-500">₹{(selectedDestinationModal.avgDailyCost || selectedDestinationModal.averageDailyCost || 6500).toLocaleString()}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Best Season</span>
                  <strong className="text-slate-900 dark:text-white">{selectedDestinationModal.bestTimeToVisit || 'Spring & Autumn'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Popularity Score</span>
                  <strong className="text-blue-500">{selectedDestinationModal.popularityScore || 96}/100</strong>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedDestinationModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Close
                </button>
                <button
                  onClick={() => handleAddDestinationAsStop(selectedDestinationModal)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add City as Stop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUICK VIEW ACTIVITY MODAL (Screen 8 Detail) */}
      {selectedActivityModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="relative aspect-video">
              <img
                src={selectedActivityModal.imageUrl}
                alt={selectedActivityModal.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedActivityModal(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-950/70 text-white hover:bg-slate-950"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-bold uppercase">
                {selectedActivityModal.category}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {selectedActivityModal.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {selectedActivityModal.description}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Location</span>
                  <strong className="text-slate-900 dark:text-white">{selectedActivityModal.city || selectedActivityModal.destination}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Duration</span>
                  <strong className="text-slate-900 dark:text-white">{selectedActivityModal.durationMinutes} mins</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Cost</span>
                  <strong className="text-emerald-500">₹{selectedActivityModal.cost.toLocaleString()}</strong>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedActivityModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const act = selectedActivityModal;
                    setSelectedActivityModal(null);
                    setAddingToDayActivity(act);
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/25 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add to Itinerary
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TARGET DAY SELECTOR MODAL FOR ADDING ACTIVITY */}
      {addingToDayActivity && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in fade-in">
            <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
              Add "{addingToDayActivity.title}" to Trip
            </h4>
            <p className="text-xs text-slate-500">
              Select which day in <strong>{activeTrip?.title}</strong> this experience belongs to:
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Itinerary Day</label>
              <select
                value={targetDayForAdd}
                onChange={(e) => setTargetDayForAdd(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              >
                {Array.from({ length: activeTrip?.totalDays || 7 }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Day {i + 1} ({activeTrip?.stops[Math.min(i, (activeTrip.stops.length || 1) - 1)]?.cityName || 'City Stop'})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setAddingToDayActivity(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAddActivity}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Confirm Addition
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

