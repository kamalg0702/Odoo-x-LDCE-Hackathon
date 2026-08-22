import React from 'react';
import { 
  Sparkles, Zap, CloudRain, AlertTriangle, CheckCircle2, 
  Share2, ArrowRight, RefreshCw, Layers 
} from 'lucide-react';
import { useTrip } from '../../context/TripContext.tsx';

interface DemoBannerProps {
  onNavigate: (tab: string) => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onNavigate }) => {
  const { 
    demoStep, triggerDemoStep, activeTrip, setIsRescueOpen, 
    setIsCopilotOpen 
  } = useTrip();

  const steps = [
    { num: 1, label: 'Dream & Plan', desc: 'AI 3-Tier Generator' },
    { num: 2, label: 'Optimize', desc: 'Route & Budget Engine' },
    { num: 3, label: 'Storm Disruption', desc: 'Simulate Heavy Rain' },
    { num: 4, label: 'Dynamic Replan', desc: 'Before vs After AI Diff' },
    { num: 5, label: 'Trip Rescue', desc: 'Missed Train Recovery' },
    { num: 6, label: 'Share & Fork', desc: 'Public Collaborative Trip' }
  ];

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white border-b border-indigo-500/20 px-3 sm:px-6 py-2.5 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Left Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold uppercase tracking-wider text-[10px] border border-blue-500/30">
            <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            2-Min Hackathon Demo
          </span>
          <span className="text-slate-300 hidden xl:inline font-medium">
            Walkthrough the adaptive travel intelligence loop:
          </span>
        </div>

        {/* Step Buttons */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto max-w-full pb-1 md:pb-0">
          {steps.map(s => {
            const isDone = demoStep > s.num;
            const isCurrent = demoStep === s.num;
            return (
              <button
                key={s.num}
                id={`demo-step-btn-${s.num}`}
                onClick={async () => {
                  await triggerDemoStep(s.num);
                  if (s.num === 1) onNavigate('create-trip');
                  if (s.num === 2) onNavigate('planner');
                  if (s.num === 3 || s.num === 4) onNavigate('planner');
                  if (s.num === 5) setIsRescueOpen(true);
                  if (s.num === 6) onNavigate('planner');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all border ${
                  isCurrent
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-cyan-400 shadow-md shadow-blue-500/30 scale-105'
                    : isDone
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-bold">
                    {s.num}
                  </span>
                )}
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Next Quick Action */}
        <button
          id="demo-flow-advance-btn"
          onClick={() => {
            const nextStep = demoStep >= 6 ? 1 : demoStep + 1;
            triggerDemoStep(nextStep);
            if (nextStep === 1) onNavigate('create-trip');
            if (nextStep === 2 || nextStep === 3 || nextStep === 4 || nextStep === 6) onNavigate('planner');
            if (nextStep === 5) setIsRescueOpen(true);
          }}
          className="shrink-0 flex items-center gap-1 px-3 py-1 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-all shadow-sm"
        >
          <span>{demoStep === 0 ? 'Start Live Demo' : demoStep >= 6 ? 'Restart Demo' : 'Next Demo Step'}</span>
          <ArrowRight className="w-3 h-3" />
        </button>

      </div>
    </div>
  );
};
