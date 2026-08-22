import React, { useState } from 'react';
import { 
  AlertTriangle, ShieldAlert, CheckCircle2, Clock, 
  ArrowRight, X, Sparkles, Train, Plane, Hotel, CalendarX, Zap 
} from 'lucide-react';
import { useTrip } from '../../context/TripContext.tsx';
import { api } from '../../services/api.ts';
import { TripRescuePlan } from '../../types/index.ts';

export const TripRescueModal: React.FC = () => {
  const { activeTrip, isRescueOpen, setIsRescueOpen, updateActiveTripLocally } = useTrip();
  const [selectedScenario, setSelectedScenario] = useState<string>('missed_train');
  const [isLoading, setIsLoading] = useState(false);
  const [rescuePlan, setRescuePlan] = useState<TripRescuePlan | null>(null);
  const [executed, setExecuted] = useState(false);

  if (!isRescueOpen) return null;

  const scenarios = [
    { id: 'missed_train', title: 'Missed Train / Transit', icon: Train, desc: 'Missed scheduled Shinkansen bullet train to Kyoto' },
    { id: 'missed_flight', title: 'Flight Delay / Missed Flight', icon: Plane, desc: '3-hour flight delay affecting evening plans' },
    { id: 'hotel_cancellation', title: 'Hotel Cancellation / Issue', icon: Hotel, desc: 'Boutique stay canceled or overbooked by property' },
    { id: 'lost_time', title: 'Running 2+ Hours Late', icon: Clock, desc: 'Tired morning or delay pushing afternoon sights' }
  ];

  const handleDiagnose = async (scId: string) => {
    setSelectedScenario(scId);
    if (!activeTrip) return;

    setIsLoading(true);
    setRescuePlan(null);
    setExecuted(false);

    try {
      const plan = await api.triggerTripRescue(activeTrip.id, scId, activeTrip);
      setRescuePlan(plan);
    } catch (err) {
      console.error('Trip Rescue error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteRescue = async () => {
    if (!rescuePlan || !activeTrip) return;

    const updatedTrip = {
      ...activeTrip,
      items: rescuePlan.suggestedItems || activeTrip.items,
      health: {
        ...activeTrip.health,
        score: 95,
        fatigueRisk: 'Low' as const,
        insights: [
          `🚨 Trip Rescue Executed: Resolved ${rescuePlan.scenario}`,
          ...activeTrip.health.insights
        ]
      }
    };

    updateActiveTripLocally(updatedTrip);
    await api.updateTrip(activeTrip.id, updatedTrip);
    setExecuted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-amber-500/30 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Urgent Emergency Header */}
        <div className="px-6 py-4 border-b border-amber-500/20 bg-gradient-to-r from-amber-500/20 via-rose-500/10 to-orange-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 font-bold">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  🚨 TRIP RESCUE MODE
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                  Instant Recovery
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                AI recalculates tickets, hotel check-ins, transit, and recovers lost time in seconds.
              </p>
            </div>
          </div>

          <button
            id="close-trip-rescue-modal-btn"
            onClick={() => setIsRescueOpen(false)}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Scenario Selectors */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Select Disruption Scenario:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {scenarios.map(sc => {
                const Icon = sc.icon;
                const isSelected = selectedScenario === sc.id;
                return (
                  <button
                    key={sc.id}
                    id={`rescue-scenario-${sc.id}`}
                    onClick={() => handleDiagnose(sc.id)}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 text-slate-900 dark:text-white shadow-md ring-1 ring-amber-500/50'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">{sc.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{sc.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Loading Animation */}
          {isLoading && (
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Rebuilding your day in real-time...</p>
              <p className="text-xs text-slate-500">Checking alternative transit timetables, hotel policies, and re-sequencing afternoon slots</p>
            </div>
          )}

          {/* Executed Success Card */}
          {executed && (
            <div className="p-5 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500 text-emerald-800 dark:text-emerald-200 space-y-2 animate-in zoom-in-95">
              <div className="flex items-center gap-2 font-extrabold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Trip Rescued! Itinerary and schedule successfully synchronized.
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                Your timeline now reflects the recovered timetable with zero missed evening reservations and confirmed alternative transit cars.
              </p>
            </div>
          )}

          {/* Actionable Recovery Plan Display */}
          {rescuePlan && !isLoading && (
            <div className="space-y-4 animate-in zoom-in-95">
              
              {/* Impact Analysis Banner */}
              <div className="p-4 rounded-2xl bg-rose-500/10 dark:bg-rose-950/30 border border-rose-500/30">
                <div className="flex items-center gap-2 text-xs font-extrabold text-rose-700 dark:text-rose-300 uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4" />
                  Impact Assessment: {rescuePlan.severity}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-1.5 leading-relaxed">
                  {rescuePlan.impactAnalysis}
                </p>
              </div>

              {/* Step by Step Action Plan */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  AI Auto-Recovery Sequence ({rescuePlan.actionSteps.length} Steps):
                </p>

                <div className="space-y-2.5">
                  {rescuePlan.actionSteps.map(step => (
                    <div
                      key={step.stepNumber}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3.5"
                    >
                      <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold text-xs shrink-0">
                        {step.stepNumber}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                            {step.title}
                          </h5>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                            {step.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Execute Button */}
              {!executed && (
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    id="cancel-rescue-btn"
                    onClick={() => setRescuePlan(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    id="execute-rescue-btn"
                    onClick={handleExecuteRescue}
                    className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2 active:scale-95"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    Execute AI Recovery Plan
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
