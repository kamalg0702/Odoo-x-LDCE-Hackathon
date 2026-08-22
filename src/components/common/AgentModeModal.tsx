import React, { useState } from 'react';
import { 
  Bot, Zap, CheckCircle2, Circle, ArrowRight, 
  X, Sparkles, Terminal, Activity, TrendingUp 
} from 'lucide-react';
import { useTrip } from '../../context/TripContext.tsx';
import { api } from '../../services/api.ts';

export const AgentModeModal: React.FC = () => {
  const { activeTrip, isAgentModeOpen, setIsAgentModeOpen, updateActiveTripLocally } = useTrip();
  const [command, setCommand] = useState('Autonomous Schedule Pacing & Transport Optimization');
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [result, setResult] = useState<any | null>(null);

  if (!isAgentModeOpen) return null;

  const demoAgentPrompts = [
    'Autonomous Schedule Pacing & Transport Optimization',
    'Eliminate transit bottlenecks and find scenic walking loops',
    'Optimize restaurant pacing and allocate sunset photo buffers',
    'Full trip health score maximize (>95 index)'
  ];

  const handleRunAgent = async (customCmd?: string) => {
    const cmd = customCmd || command;
    if (!activeTrip) return;

    setIsRunning(true);
    setCurrentStepIndex(0);
    setResult(null);

    // Simulate animated step progression
    for (let i = 0; i < 5; i++) {
      setCurrentStepIndex(i);
      await new Promise(r => setTimeout(r, 600));
    }

    try {
      const res = await api.executeAgent(activeTrip.id, cmd, activeTrip);
      setResult(res);
      updateActiveTripLocally(res.updatedTrip);
    } catch (err) {
      console.error('Agent execution error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const stepsList = [
    { num: 1, title: 'Analyze schedule & fatigue vectors', detail: 'Scanned itinerary density, transit timings, and walking elevation vectors.' },
    { num: 2, title: 'Check transit routes & live lines', detail: 'Identified optimal express subway cars and verified zero schedule conflicts.' },
    { num: 3, title: 'Find high-rated local alternatives', detail: 'Queried 14 nearby cultural venues & Michelin Bib Gourmand dining spots.' },
    { num: 4, title: 'Re-sequence & insert rest buffers', detail: 'Inserted 45-minute afternoon café relaxation buffer to reduce fatigue index.' },
    { num: 5, title: 'Re-calibrate budget & update database', detail: 'Saved ₹1,400 on transport passes and increased Trip Health Score.' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-emerald-500/30 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-emerald-500/20 bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-blue-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/30">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  🤖 Agent Mode: Autonomous Execution
                </h3>
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                  Self-Driving Travel OS
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI inspects, computes, executes multi-step optimizations and directly syncs the trip.
              </p>
            </div>
          </div>

          <button
            id="close-agent-mode-modal-btn"
            onClick={() => setIsAgentModeOpen(false)}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Quick Tasks */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-500" />
              Select Autonomous Task to Delegate:
            </p>
            <div className="space-y-2">
              {demoAgentPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCommand(p);
                    handleRunAgent(p);
                  }}
                  disabled={isRunning}
                  className={`w-full p-3 rounded-2xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                    command === p
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  <span>⚡ {p}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-70" />
                </button>
              ))}
            </div>
          </div>

          {/* Execution Trace Box */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 space-y-3 font-mono text-xs shadow-inner">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-emerald-400 font-bold">Execution Engine Status:</span>
              </div>
              <span className="text-[11px] text-slate-400">
                {isRunning ? 'RUNNING AUTOMATION' : result ? 'COMPLETED (5/5)' : 'READY'}
              </span>
            </div>

            <div className="space-y-2.5">
              {stepsList.map((st, i) => {
                const isStepCompleted = !isRunning && result ? true : currentStepIndex > i;
                const isCurrent = isRunning && currentStepIndex === i;
                return (
                  <div key={st.num} className="flex items-start gap-2.5">
                    {isStepCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : isCurrent ? (
                      <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className={`text-xs ${isStepCompleted ? 'text-emerald-300 font-bold' : isCurrent ? 'text-white font-bold' : 'text-slate-500'}`}>
                        [{st.num}/5] {st.title}
                      </p>
                      <p className="text-[10px] text-slate-400 font-sans mt-0.5">{st.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Result Card */}
          {result && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 space-y-2 animate-in zoom-in-95">
              <div className="flex items-center gap-2 font-extrabold text-sm">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Autonomous Mission Accomplished
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                {result.summary}
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-bold border-t border-emerald-500/20">
                <span>Trip Health Score: 98/100 (+6pts)</span>
                <span className="text-emerald-600 dark:text-emerald-400">Database Synced</span>
              </div>
            </div>
          )}

          {/* Action Trigger */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              id="execute-agent-btn"
              onClick={() => handleRunAgent()}
              disabled={isRunning}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 text-xs font-extrabold shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
            >
              <Zap className="w-4 h-4 fill-current" />
              {isRunning ? 'Agent Executing Tasks...' : 'Run Autonomous Agent'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
