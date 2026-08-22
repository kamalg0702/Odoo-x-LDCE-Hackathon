import React, { useState } from 'react';
import { 
  Trip, ItineraryItem, ReplanningResult, RouteOptimizationResult 
} from '../types/index.ts';
import { 
  Compass, MapPin, Calendar, DollarSign, Sparkles, 
  Share2, Copy, CloudRain, AlertTriangle, Check, 
  Layers, Map as MapIcon, BarChart3, Clock, ArrowRight, 
  ShieldCheck, RefreshCw, Bot, ChevronRight, X 
} from 'lucide-react';
import { useTrip } from '../context/TripContext.tsx';
import { api } from '../services/api.ts';
import { ItineraryTimeline } from '../components/timeline/ItineraryTimeline.tsx';
import { TripMap } from '../components/map/TripMap.tsx';
import { TripCalendarView } from '../components/calendar/TripCalendarView.tsx';
import { BudgetAnalyticsView } from '../components/budget/BudgetAnalyticsView.tsx';

interface TripDetailsPageProps {
  onNavigate: (tab: string) => void;
}

export const TripDetailsPage: React.FC<TripDetailsPageProps> = ({ onNavigate }) => {
  const { 
    activeTrip, setActiveTrip, updateActiveTripLocally, 
    focusedItemId, setFocusedItemId, setIsCopilotOpen, 
    setIsRescueOpen, loadTrips 
  } = useTrip();

  const [activeWorkspaceView, setActiveWorkspaceView] = useState<'split' | 'timeline' | 'map' | 'calendar' | 'budget'>('split');
  const [selectedDay, setSelectedDay] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [forkSuccess, setForkSuccess] = useState(false);

  // Dynamic Replanning State (Before vs After)
  const [replanResult, setReplanResult] = useState<ReplanningResult | null>(null);
  const [isReplanning, setIsReplanning] = useState(false);

  // Route Optimization State
  const [routeOptResult, setRouteOptResult] = useState<RouteOptimizationResult | null>(null);
  const [isOptimizingRoute, setIsOptimizingRoute] = useState(false);

  if (!activeTrip) {
    return (
      <div className="text-center py-20 space-y-4">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">No Active Trip Selected</h3>
        <p className="text-xs text-slate-500">Create a new AI itinerary or pick from your dashboard.</p>
        <button
          onClick={() => onNavigate('create-trip')}
          className="px-6 py-2.5 rounded-2xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/25"
        >
          Plan New Journey
        </button>
      </div>
    );
  }

  const handleTriggerReplan = async (disruptionType: string) => {
    setIsReplanning(true);
    setReplanResult(null);
    try {
      const res = await api.dynamicReplan(activeTrip.id, disruptionType, 5, activeTrip);
      setReplanResult(res);
    } catch (err) {
      console.error('Dynamic replan error:', err);
    } finally {
      setIsReplanning(false);
    }
  };

  const handleApplyReplan = async () => {
    if (!replanResult) return;
    const updatedTrip = {
      ...activeTrip,
      items: replanResult.updatedItems,
      weather: replanResult.updatedWeather,
      estimatedCost: replanResult.afterCost,
      health: {
        ...activeTrip.health,
        score: 96,
        fatigueRisk: 'Low' as const,
        insights: [
          `⚡ Dynamic Replan Applied: ${replanResult.disruptionCause}`,
          ...activeTrip.health.insights
        ]
      }
    };

    updateActiveTripLocally(updatedTrip);
    await api.updateTrip(activeTrip.id, updatedTrip);
    setReplanResult(null);
    setSelectedDay(replanResult.affectedDay);
  };

  const handleOptimizeRoute = async () => {
    setIsOptimizingRoute(true);
    try {
      const res = await api.optimizeRoute(activeTrip.id, selectedDay, activeTrip);
      setRouteOptResult(res);
    } catch (err) {
      console.error('Optimize route error:', err);
    } finally {
      setIsOptimizingRoute(false);
    }
  };

  const handleApplyRouteOptimization = async () => {
    if (!routeOptResult) return;
    const updatedTrip = {
      ...activeTrip,
      items: routeOptResult.optimizedItems,
      health: {
        ...activeTrip.health,
        score: 97,
        insights: [
          `Route Optimizer Applied: Saved ${routeOptResult.minutesSaved}m travel time & ${activeTrip.currency}${routeOptResult.costSaved}`,
          ...activeTrip.health.insights
        ]
      }
    };
    updateActiveTripLocally(updatedTrip);
    await api.updateTrip(activeTrip.id, updatedTrip);
    setRouteOptResult(null);
  };

  const handleShare = () => {
    const url = `${window.location.origin}?tripId=${activeTrip.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleForkTrip = async () => {
    try {
      const forked = await api.copyTrip(activeTrip.id, 'user_rahul');
      await loadTrips();
      setActiveTrip(forked);
      setForkSuccess(true);
      setTimeout(() => setForkSuccess(false), 3000);
    } catch (err) {
      console.error('Fork trip error:', err);
    }
  };

  return (
    <div className="space-y-6 py-4">
      
      {/* Top Banner / Hero of Trip */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white border border-slate-800 shadow-lg">
        <img
          src={activeTrip.coverImage}
          alt={activeTrip.title}
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="relative p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-500 text-white">
                Active Itinerary
              </span>
              <span className="text-xs font-bold text-slate-300">
                {activeTrip.startDate} – {activeTrip.endDate} ({activeTrip.totalDays} Days)
              </span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Trip Health: {activeTrip.health?.score}/100
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {activeTrip.title}
            </h1>

            <p className="text-xs text-slate-300 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{activeTrip.stops.map(s => s.cityName).join(' → ')}</span>
              <span>•</span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Est. Cost: {activeTrip.currency}{activeTrip.estimatedCost.toLocaleString()}</span>
            </p>
          </div>

          {/* Quick AI & Utility Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Route Optimizer Button */}
            <button
              id="optimize-route-btn"
              onClick={handleOptimizeRoute}
              disabled={isOptimizingRoute}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isOptimizingRoute ? 'Optimizing Routes...' : 'Optimize Routes'}
            </button>

            {/* Dynamic Replan Trigger */}
            <button
              id="replan-weather-btn"
              onClick={() => handleTriggerReplan('rain')}
              className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <CloudRain className="w-3.5 h-3.5" />
              Simulate Rain Replan
            </button>

            {/* Share Button */}
            <button
              id="share-trip-btn"
              onClick={handleShare}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 flex items-center gap-1.5 transition-all"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              {copiedLink ? 'Link Copied!' : 'Share'}
            </button>

            {/* Fork/Copy Trip */}
            <button
              id="fork-trip-btn"
              onClick={handleForkTrip}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 flex items-center gap-1.5 transition-all"
              title="Duplicate & create personal editable copy"
            >
              {forkSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {forkSuccess ? 'Forked!' : 'Fork / Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* Workspace View Mode Selector */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'split', label: 'Split View (Timeline + Map)', icon: Layers },
            { id: 'timeline', label: 'Timeline Only', icon: Clock },
            { id: 'map', label: 'Full Interactive Map', icon: MapIcon },
            { id: 'calendar', label: 'Calendar Schedule', icon: Calendar },
            { id: 'budget', label: 'Budget & Savings', icon: BarChart3 }
          ].map(tab => {
            const Icon = tab.icon;
            const isTabActive = activeWorkspaceView === tab.id;
            return (
              <button
                key={tab.id}
                id={`workspace-view-${tab.id}`}
                onClick={() => setActiveWorkspaceView(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  isTabActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          id="workspace-copilot-trigger-btn"
          onClick={() => setIsCopilotOpen(true)}
          className="hidden sm:flex items-center gap-1 text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Ask AI to Adjust Trip
        </button>
      </div>

      {/* Main Workspace Display based on Tab */}
      {activeWorkspaceView === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <ItineraryTimeline
              trip={activeTrip}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              focusedItemId={focusedItemId}
              setFocusedItemId={setFocusedItemId}
              onTripUpdate={updateActiveTripLocally}
              onTriggerReplan={handleTriggerReplan}
            />
          </div>
          <div className="lg:col-span-5 sticky top-20 h-[650px]">
            <TripMap
              trip={activeTrip}
              selectedDay={selectedDay}
              focusedItemId={focusedItemId}
              onItemSelect={(item) => setFocusedItemId(item.id)}
            />
          </div>
        </div>
      )}

      {activeWorkspaceView === 'timeline' && (
        <div className="max-w-4xl mx-auto">
          <ItineraryTimeline
            trip={activeTrip}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            focusedItemId={focusedItemId}
            setFocusedItemId={setFocusedItemId}
            onTripUpdate={updateActiveTripLocally}
            onTriggerReplan={handleTriggerReplan}
          />
        </div>
      )}

      {activeWorkspaceView === 'map' && (
        <div className="h-[650px]">
          <TripMap
            trip={activeTrip}
            selectedDay={selectedDay}
            focusedItemId={focusedItemId}
            onItemSelect={(item) => setFocusedItemId(item.id)}
          />
        </div>
      )}

      {activeWorkspaceView === 'calendar' && (
        <TripCalendarView
          trip={activeTrip}
          onSelectActivity={(item) => setFocusedItemId(item.id)}
        />
      )}

      {activeWorkspaceView === 'budget' && (
        <BudgetAnalyticsView
          trip={activeTrip}
          onTripUpdate={updateActiveTripLocally}
        />
      )}

      {/* Dynamic Replanning Before vs After Modal (Mandatory Core Differentiator) */}
      {replanResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-amber-500/40 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-amber-500/20 bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-indigo-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">
                  <CloudRain className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    ⚡ Dynamic Replanning Engine
                    <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300">
                      Disruption Detected
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {replanResult.disruptionCause}
                  </p>
                </div>
              </div>

              <button
                id="close-replan-modal-btn"
                onClick={() => setReplanResult(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body: BEFORE vs AFTER Comparison Card */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* BEFORE CARD */}
                <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-rose-600 uppercase tracking-wider">
                      🔴 BEFORE REPLAN
                    </span>
                    <span className="text-xs font-bold text-slate-500">Outdoor Walking</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    <p className="font-bold">• Outdoor Castle Park & Street Walking</p>
                    <p>• Transit Exposure: 4 hours outdoor transit</p>
                    <p>• Estimated Day Cost: {activeTrip.currency}{replanResult.beforeCost}</p>
                    <p className="text-rose-600 font-semibold">• High risk of rain soaking & transit cancellation</p>
                  </div>
                </div>

                {/* AFTER CARD */}
                <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      🟢 AFTER AI REPLAN
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">100% Rainproof</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    <p className="font-bold text-emerald-700 dark:text-emerald-300">• Covered Museum & Machiya Tea Masterclass</p>
                    <p>• Weather Protected: 2h 20m transit via covered subway link</p>
                    <p>• Optimized Day Cost: {activeTrip.currency}{replanResult.afterCost} (-{activeTrip.currency}{replanResult.beforeCost - replanResult.afterCost})</p>
                    <p className="text-emerald-600 font-semibold">• 0% rain disruption risk + High cultural DNA match</p>
                  </div>
                </div>

              </div>

              {/* Itemized Changes Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  AI Adaptations Made:
                </p>
                <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {replanResult.changesSummary.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  id="reject-replan-btn"
                  onClick={() => setReplanResult(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Discard
                </button>
                <button
                  id="apply-replan-btn"
                  onClick={handleApplyReplan}
                  className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  Apply Dynamic Replan
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Route Optimization Result Modal */}
      {routeOptResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-blue-500/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Route Clustered & Optimized
                </h4>
              </div>
              <button onClick={() => setRouteOptResult(null)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {routeOptResult.rationale}
            </p>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-500/20 text-xs">
              <div>
                <p className="text-slate-500 font-medium">Transit Time Saved</p>
                <p className="text-lg font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">
                  {routeOptResult.minutesSaved} Minutes
                </p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Subway Fares Saved</p>
                <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {activeTrip.currency}{routeOptResult.costSaved}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRouteOptResult(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyRouteOptimization}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/25"
              >
                Apply Re-Sequencing
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
