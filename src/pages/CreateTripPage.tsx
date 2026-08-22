import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Compass, MapPin, Calendar, DollarSign, 
  Users, Zap, ArrowRight, CheckCircle2, ChevronRight, 
  Layers, Clock, ShieldCheck, Heart, Image, FileText, 
  Plus, Check, Sliders, Palette, RotateCcw, User as UserIcon
} from 'lucide-react';
import { api } from '../services/api.ts';
import { useTrip } from '../context/TripContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { AIPlanOption, TravelGroupType, TravelPaceType } from '../types/index.ts';

interface CreateTripPageProps {
  onNavigate: (tab: string) => void;
}

export const CreateTripPage: React.FC<CreateTripPageProps> = ({ onNavigate }) => {
  const { setActiveTrip, loadTrips } = useTrip();
  const { user } = useAuth();

  // Mode: AI Multi-Tier or Custom Manual (Screen 3)
  const [creationMode, setCreationMode] = useState<'ai' | 'manual'>('ai');

  // Common Fields
  const [tripName, setTripName] = useState('Autumn Sakura & Ancient Temples');
  const [destination, setDestination] = useState('Tokyo & Kyoto, Japan');
  const [tripDescription, setTripDescription] = useState('An immersive 7-day culinary, photographic, and historical exploration through Tokyo, Kyoto, and Osaka.');
  const [coverPhoto, setCoverPhoto] = useState('https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-07');
  const [totalDays, setTotalDays] = useState(7);
  const [budget, setBudget] = useState(65000);
  const [currency, setCurrency] = useState(user?.currency || '₹');
  const [travelGroup, setTravelGroup] = useState<TravelGroupType>('couple');
  const [travelPace, setTravelPace] = useState<TravelPaceType>('balanced');
  const [interests, setInterests] = useState<string[]>(['food', 'photography', 'culture']);

  // Sync currency from user if available
  useEffect(() => {
    if (user?.currency) {
      setCurrency(user.currency);
    }
  }, [user]);

  // Reset to blank/fresh canvas
  const handleResetToBlank = () => {
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
    setTripName('');
    setDestination('');
    setTripDescription('');
    setCoverPhoto('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80');
    setStartDate(today);
    setEndDate(nextWeek);
    setTotalDays(7);
    setBudget(50000);
    setInterests(['food', 'culture']);
  };

  // AI Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSavingManual, setIsSavingManual] = useState(false);
  const [generatedOptions, setGeneratedOptions] = useState<AIPlanOption[] | null>(null);

  const presetPhotos = [
    { name: 'Tokyo Neon & Shrines', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80' },
    { name: 'Kyoto Bamboo Forest', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80' },
    { name: 'Parisian Sunset', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80' },
    { name: 'Bali Emerald Terraces', url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80' },
    { name: 'Rome Colosseum', url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop&q=80' },
    { name: 'Swiss Alps & Glaciers', url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&auto=format&fit=crop&q=80' }
  ];

  const interestOptions = [
    { id: 'food', label: '🍜 Street Food & Dining' },
    { id: 'photography', label: '📸 Golden Hour Photography' },
    { id: 'culture', label: '⛩️ Temples & Historic Shrines' },
    { id: 'nature', label: '🌸 Gardens & Nature Walks' },
    { id: 'shopping', label: '🛍️ Night Markets & Boutiques' },
    { id: 'adventure', label: '🧗 Outdoor Adventure' }
  ];

  const toggleInterest = (id: string) => {
    setInterests(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    if (new Date(val) > new Date(endDate)) {
      setEndDate(val);
      setTotalDays(1);
    } else {
      const diff = Math.max(1, Math.round((new Date(endDate).getTime() - new Date(val).getTime()) / (1000 * 60 * 60 * 24)) + 1);
      setTotalDays(diff);
    }
  };

  const handleEndDateChange = (val: string) => {
    setEndDate(val);
    const diff = Math.max(1, Math.round((new Date(val).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1);
    setTotalDays(diff);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGeneratedOptions(null);

    try {
      const res = await api.generateTrip({
        destination,
        startDate,
        endDate,
        totalDays,
        budget,
        currency,
        travelGroup,
        travelPace,
        interests
      });

      if (res.options && res.options.length > 0) {
        setGeneratedOptions(res.options);
      }
    } catch (err) {
      console.error('Trip generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectPlan = async (option: AIPlanOption) => {
    try {
      const newTrip = await api.createTrip({
        title: `${destination} (${option.title || option.tier})`,
        description: option.description || option.tagline || option.summary || 'AI-generated multi-city itinerary.',
        coverImage: coverPhoto,
        startDate,
        endDate,
        totalDays,
        currency,
        totalBudget: budget,
        estimatedCost: option.totalCost,
        travelGroup,
        travelPace,
        interests,
        stops: option.stops || [],
        items: option.items || []
      });

      await loadTrips();
      setActiveTrip(newTrip);
      onNavigate('planner');
    } catch (err) {
      console.error('Save generated trip error:', err);
    }
  };

  const handleSaveManualTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingManual(true);
    try {
      // Create initial stops based on destination input
      const cityList = destination.split(/[,&]/).map(c => c.trim()).filter(Boolean);
      const stops = cityList.map((cityName, idx) => ({
        id: `stop_manual_${Date.now()}_${idx}`,
        cityName: cityName,
        country: 'Global',
        arrivalDate: startDate,
        departureDate: endDate,
        order: idx + 1,
        lat: 35.6762 + (idx * 0.1),
        lng: 139.6503 + (idx * 0.1)
      }));

      const newTrip = await api.createTrip({
        title: tripName || destination,
        description: tripDescription,
        coverImage: coverPhoto,
        startDate,
        endDate,
        totalDays,
        currency,
        totalBudget: budget,
        estimatedCost: Math.round(budget * 0.85),
        travelGroup,
        travelPace,
        interests,
        stops: stops.length > 0 ? stops : [{
          id: `stop_${Date.now()}`,
          cityName: destination,
          country: 'Global',
          arrivalDate: startDate,
          departureDate: endDate,
          order: 1,
          lat: 35.6762,
          lng: 139.6503
        }],
        items: [
          {
            id: `item_init_${Date.now()}`,
            tripId: '',
            stopId: stops[0]?.id || 'stop_1',
            dayNumber: 1,
            date: startDate,
            title: `Arrival in ${destination.split(',')[0]} & Check-in`,
            category: 'relaxation',
            timeSlot: 'morning',
            startTime: '10:00',
            endTime: '12:00',
            durationMinutes: 120,
            cost: 2500,
            locationName: destination.split(',')[0],
            lat: 35.6762,
            lng: 139.6503,
            description: 'Check in to hotel, unpack, and orient with local transit pass.',
            aiMatchScore: 95,
            status: 'planned'
          },
          {
            id: `item_init_2_${Date.now()}`,
            tripId: '',
            stopId: stops[0]?.id || 'stop_1',
            dayNumber: 1,
            date: startDate,
            title: 'Welcome Dinner & Evening Walk',
            category: 'food',
            timeSlot: 'evening',
            startTime: '19:00',
            endTime: '21:00',
            durationMinutes: 120,
            cost: 1800,
            locationName: destination.split(',')[0],
            lat: 35.6762,
            lng: 139.6503,
            description: 'Experience local authentic delicacies and bustling night views.',
            aiMatchScore: 92,
            status: 'planned'
          }
        ]
      });

      await loadTrips();
      setActiveTrip(newTrip);
      onNavigate('builder');
    } catch (err) {
      console.error('Manual trip save error:', err);
    } finally {
      setIsSavingManual(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      
      {/* Header & Screen 3 Badge */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-extrabold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Trip Studio (Screen 3)</span>
          {user?.name && (
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 normal-case border-l border-blue-200 dark:border-blue-800 pl-2 flex items-center gap-1">
              <UserIcon className="w-3 h-3 text-blue-500" />
              {user.name}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Design Your Next Journey
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Start from scratch with a custom multi-city itinerary, or let AI craft 3 tailored budget tiers in seconds.
        </p>

        {/* Quick Toolbar: Mode Selector & Reset to Blank */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              id="create-mode-ai-btn"
              onClick={() => setCreationMode('ai')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                creationMode === 'ai'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI 3-Tier Generator</span>
            </button>

            <button
              type="button"
              id="create-mode-manual-btn"
              onClick={() => setCreationMode('manual')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                creationMode === 'manual'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Custom Direct Setup</span>
            </button>
          </div>

          <button
            type="button"
            id="create-reset-blank-btn"
            onClick={handleResetToBlank}
            title="Wipe current form to start completely blank"
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Blank Canvas</span>
          </button>
        </div>

        {/* Quick Inspiration Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-400">Popular:</span>
          {[
            { name: 'Tokyo & Kyoto', photo: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80', title: 'Japanese Autumn Discovery' },
            { name: 'Paris & Nice', photo: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80', title: 'Romantic French Riviera Tour' },
            { name: 'Bali & Ubud', photo: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80', title: 'Tropical Bali Island Getaway' },
            { name: 'Rome & Florence', photo: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop&q=80', title: 'Renaissance & Ancient Italy' },
            { name: 'Goa & Mumbai', photo: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80', title: 'Coastal Goa & Heritage' },
          ].map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => {
                setDestination(item.name);
                setTripName(item.title);
                setCoverPhoto(item.photo);
              }}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer shadow-2xs"
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* MANUAL TRIP CREATION FORM (Screen 3 Explicit Form) */}
      {creationMode === 'manual' && (
        <form onSubmit={handleSaveManualTrip} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          
          {/* Trip Name & Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                Trip Name
              </label>
              <input
                type="text"
                required
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                placeholder="e.g. Japanese Heritage & Culinary Tour"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                Destination Cities
              </label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Tokyo, Kyoto, Osaka"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Dates & Calculation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                Start Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                End Date
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                Duration (Days)
              </label>
              <input
                type="number"
                readOnly
                value={totalDays}
                className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-extrabold text-blue-600 dark:text-blue-400"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              Trip Description
            </label>
            <textarea
              rows={3}
              value={tripDescription}
              onChange={(e) => setTripDescription(e.target.value)}
              placeholder="Describe your travel goals, highlights you want to experience, or pacing notes..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Cover Photo Selector (Screen 3: Cover Photo Upload/Picker) */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Image className="w-3.5 h-3.5 text-purple-500" />
                Cover Photo (Preset Gallery or Custom URL)
              </span>
              <span className="text-[11px] text-slate-400">Click to select travel cover</span>
            </label>

            {/* Photo Previews */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              {presetPhotos.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => setCoverPhoto(p.url)}
                  className={`group relative aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    coverPhoto === p.url ? 'border-blue-600 scale-102 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                  {coverPhoto === p.url && (
                    <div className="absolute inset-0 bg-blue-600/40 flex items-center justify-center text-white">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Custom Photo URL Input */}
            <input
              type="url"
              value={coverPhoto}
              onChange={(e) => setCoverPhoto(e.target.value)}
              placeholder="Or paste custom image URL..."
              className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
            />
          </div>

          {/* Budget & Travel Group */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                Estimated Total Budget
              </label>
              <div className="flex gap-2">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="px-3 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="₹">₹ INR</option>
                  <option value="$">$ USD</option>
                  <option value="€">€ EUR</option>
                  <option value="£">£ GBP</option>
                  <option value="¥">¥ JPY</option>
                </select>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
                <Users className="w-3.5 h-3.5 text-purple-500" />
                Travel Group
              </label>
              <select
                value={travelGroup}
                onChange={(e) => setTravelGroup(e.target.value as TravelGroupType)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white"
              >
                <option value="solo">Solo Explorer</option>
                <option value="couple">Couple / Duo</option>
                <option value="family">Family with Kids</option>
                <option value="friends">Group of Friends</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Travel Pacing
              </label>
              <select
                value={travelPace}
                onChange={(e) => setTravelPace(e.target.value as TravelPaceType)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white"
              >
                <option value="relaxed">Relaxed (1-2 major spots/day)</option>
                <option value="balanced">Balanced (2-3 spots/day)</option>
                <option value="packed">Fast-Paced (4+ spots/day)</option>
              </select>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              id="save-manual-trip-btn"
              disabled={isSavingManual}
              className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSavingManual ? 'Saving Trip...' : 'Save & Open Itinerary Builder'}</span>
            </button>
          </div>
        </form>
      )}

      {/* AI GENERATOR FORM */}
      {creationMode === 'ai' && (
        <form onSubmit={handleGenerate} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          
          {/* Destination & Duration Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                Destinations (Single or Multi-City)
              </label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Tokyo, Kyoto, Osaka or Paris & Rome"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                Total Days
              </label>
              <input
                type="number"
                min={2}
                max={30}
                value={totalDays}
                onChange={(e) => setTotalDays(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Budget & Group Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                Total Budget Cap
              </label>
              <div className="flex gap-2">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="px-3 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="₹">₹ INR</option>
                  <option value="$">$ USD</option>
                  <option value="€">€ EUR</option>
                  <option value="£">£ GBP</option>
                  <option value="¥">¥ JPY</option>
                </select>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
                <Users className="w-3.5 h-3.5 text-purple-500" />
                Travel Group
              </label>
              <select
                value={travelGroup}
                onChange={(e) => setTravelGroup(e.target.value as TravelGroupType)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white"
              >
                <option value="solo">Solo Explorer</option>
                <option value="couple">Couple / Duo</option>
                <option value="family">Family with Kids</option>
                <option value="friends">Group of Friends</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-500" />
                Pacing Preference
              </label>
              <select
                value={travelPace}
                onChange={(e) => setTravelPace(e.target.value as TravelPaceType)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white"
              >
                <option value="relaxed">Slow & Relaxed (2 sights/day)</option>
                <option value="balanced">Balanced Explorer (3-4 sights/day)</option>
                <option value="fast">Fast-Paced Action (5+ sights/day)</option>
              </select>
            </div>
          </div>

          {/* Interests Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 block">
              Travel Style & Interests (Travel DNA Match)
            </label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map(opt => {
                const isSelected = interests.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleInterest(opt.id)}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/25'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              id="create-trip-submit-btn"
              disabled={isGenerating}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-blue-500/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isGenerating ? 'Synthesizing 3 AI Itinerary Tiers...' : 'Generate 3 Trip Tiers'}
            </button>
          </div>

        </form>
      )}

      {/* Loading Indicator */}
      {isGenerating && (
        <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm animate-pulse">
          <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            AI Architect is orchestrating your journey...
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Computing route topology, comparing JR bullet train passes vs metro passes, and pairing high-synergy culinary experiences.
          </p>
        </div>
      )}

      {/* 3-Tier Results Display */}
      {generatedOptions && !isGenerating && (
        <div className="space-y-4 animate-in zoom-in-95">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              Choose Your AI Itinerary Tier:
            </h3>
            <span className="text-xs text-slate-500">
              Select one to load into the full interactive workspace
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {generatedOptions.map((opt) => (
              <div
                key={opt.tier}
                className={`p-6 rounded-3xl border flex flex-col justify-between transition-all bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl ${
                  opt.tier === 'balanced'
                    ? 'border-blue-500 ring-2 ring-blue-500/30 relative'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {opt.tier === 'balanced' && (
                  <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-extrabold shadow-md">
                    Most Popular Choice
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    {opt.tag && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        {opt.tag}
                      </span>
                    )}
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white mt-2">
                      {opt.title || opt.tier}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {opt.description || opt.tagline || opt.summary}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Total Est. Cost:</span>
                      <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                        {opt.currency}{opt.totalCost.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Stops:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {opt.stops?.map(s => s.cityName).join(', ') || 'Multi-City Tour'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Activities:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {opt.items?.length || 0} curated stops
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => handleSelectPlan(opt)}
                    className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <span>Adopt This Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
