import React, { useState } from 'react';
import { 
  Sparkles, Send, X, Check, Trash2, ArrowRight, 
  TrendingDown, Clock, Heart, Bot, HelpCircle, AlertCircle 
} from 'lucide-react';
import { useTrip } from '../../context/TripContext.tsx';
import { api } from '../../services/api.ts';
import { AICopilotActionProposal } from '../../types/index.ts';

export const AICopilotModal: React.FC = () => {
  const { activeTrip, isCopilotOpen, setIsCopilotOpen, updateActiveTripLocally, refreshActiveTrip } = useTrip();
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [proposal, setProposal] = useState<AICopilotActionProposal | null>(null);
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  if (!isCopilotOpen) return null;

  const quickPrompts = [
    'Make my trip cheaper',
    'Add more authentic food experiences',
    "I don't want to wake up early (shift to 10 AM)",
    'Give me a free afternoon for café hopping',
    'Make tomorrow less tiring & add rest buffers',
    'Optimize for sunset photography spots'
  ];

  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || inputPrompt;
    if (!promptToSend.trim() || !activeTrip) return;

    setIsLoading(true);
    setProposal(null);
    setAppliedNotification(null);

    try {
      const res = await api.triggerCopilot(activeTrip.id, promptToSend, activeTrip);
      setProposal(res);
      setInputPrompt('');
    } catch (err) {
      console.error('Copilot prompt error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyChanges = async () => {
    if (!proposal || !activeTrip) return;

    // Apply optimizations to active trip
    const updatedCost = Math.max(10000, activeTrip.estimatedCost + proposal.stats.costDiff);
    const updatedHealthScore = Math.min(99, activeTrip.health.score + proposal.stats.healthScoreChange);

    const updatedTrip = {
      ...activeTrip,
      estimatedCost: updatedCost,
      health: {
        ...activeTrip.health,
        score: updatedHealthScore,
        fatigueRisk: 'Low' as const,
        insights: [
          `AI Applied: ${proposal.summary}`,
          ...activeTrip.health.insights
        ]
      }
    };

    updateActiveTripLocally(updatedTrip);
    await api.updateTrip(activeTrip.id, updatedTrip);

    setAppliedNotification(`Successfully applied ${proposal.changes.length} itinerary modifications!`);
    setProposal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-cyan-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                GlobeTrotter AI Copilot
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold">
                  Active Assistant
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Context: {activeTrip?.title || 'Active Trip'}
              </p>
            </div>
          </div>

          <button
            id="close-copilot-modal-btn"
            onClick={() => setIsCopilotOpen(false)}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Quick Suggestions Chips */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5" />
              Suggested Commands
            </p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(qp)}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-500/15 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-medium transition-all text-left border border-transparent hover:border-blue-300 dark:hover:border-blue-500/30"
                >
                  ✨ {qp}
                </button>
              ))}
            </div>
          </div>

          {/* Success Notification */}
          {appliedNotification && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-3 text-xs font-bold">
              <Check className="w-5 h-5 shrink-0 text-emerald-500" />
              <span>{appliedNotification}</span>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="p-8 flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Analyzing itinerary vectors & crafting changes...</p>
              <p className="text-xs text-slate-500">Checking route pacing, transit costs, and travel DNA matches</p>
            </div>
          )}

          {/* AI Action Preview Card (Mandatory Requirement) */}
          {proposal && !isLoading && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-2 border-blue-500/40 shadow-lg space-y-4 animate-in zoom-in-95">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-blue-500 text-white">
                    Action Preview
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1.5">
                    AI proposes {proposal.changes.length} itinerary modifications:
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    {proposal.summary}
                  </p>
                </div>

                {/* Metric Badges */}
                <div className="flex flex-col gap-1 text-right shrink-0">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 justify-end">
                    <TrendingDown className="w-3.5 h-3.5" />
                    Save {activeTrip?.currency}{Math.abs(proposal.stats.costDiff)}
                  </span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 justify-end">
                    <Clock className="w-3.5 h-3.5" />
                    Save {proposal.stats.travelTimeSavedMinutes}m transit
                  </span>
                </div>
              </div>

              {/* Itemized Changes List */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                {proposal.changes.map(ch => (
                  <div key={ch.id} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{ch.description}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">💡 {ch.impact}</p>
                    </div>
                    {ch.dayNumber && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                        Day {ch.dayNumber}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  id="reject-copilot-proposal-btn"
                  onClick={() => setProposal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Reject
                </button>
                <button
                  id="apply-copilot-proposal-btn"
                  onClick={handleApplyChanges}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/25 transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <Check className="w-3.5 h-3.5" />
                  Apply Changes
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              id="copilot-input-field"
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Tell GlobeTrotter AI what you want to change..."
              className="flex-1 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              id="copilot-submit-btn"
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 transition-opacity disabled:opacity-40 shadow-md shadow-blue-500/25 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
