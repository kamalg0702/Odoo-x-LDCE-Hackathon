import React, { useState, useEffect } from 'react';
import { 
  Dna, Sparkles, Award, MapPin, Check, 
  Flame, Globe, Sliders, RefreshCw, Trophy 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { Achievement, TravelDNA } from '../types/index.ts';
import { 
  ResponsiveContainer, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';

export const TravelDNAPage: React.FC = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [dnaValues, setDnaValues] = useState<TravelDNA>(
    user?.travelDNA || {
      foodExplorer: 90,
      beachLover: 70,
      adventure: 75,
      culture: 85,
      photography: 95,
      luxury: 60,
      budgetConscious: 80,
      slowTravel: 65
    }
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadAchievements() {
      try {
        const data = await api.getAchievements();
        setAchievements(data);
      } catch (err) {
        console.error('Achievements load error:', err);
      }
    }
    loadAchievements();
  }, []);

  const radarData = [
    { subject: 'Food Explorer', A: dnaValues.foodExplorer, fullMark: 100 },
    { subject: 'Photography', A: dnaValues.photography, fullMark: 100 },
    { subject: 'Culture & History', A: dnaValues.culture, fullMark: 100 },
    { subject: 'Budget Minded', A: dnaValues.budgetConscious, fullMark: 100 },
    { subject: 'Slow Rest', A: dnaValues.slowTravel, fullMark: 100 },
    { subject: 'Adventure', A: dnaValues.adventure, fullMark: 100 },
    { subject: 'Beach Lover', A: dnaValues.beachLover, fullMark: 100 },
    { subject: 'Luxury Comfort', A: dnaValues.luxury, fullMark: 100 }
  ];

  const handleSliderChange = (key: keyof TravelDNA, val: number) => {
    setDnaValues(prev => ({ ...prev, [key]: val }));
  };

  const handleSaveDNA = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Dna className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Travel DNA & Gamification Hub
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            GlobeTrotter AI's 8-dimensional profile that calibrates all your itinerary recommendations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-extrabold text-xs">
            🏆 {user?.level || 'Novice Explorer'} ({user?.xp || 250} XP)
          </span>
        </div>
      </div>

      {/* Main Radar & Interactive Calibrator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Radar Visualizer */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center justify-between">
              <span>Dynamic Radar Map</span>
              <span className="text-xs text-purple-500 font-bold">Live AI Matrix</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Reflects your current travel tendencies across 8 vectors
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#94a3b8" opacity={0.25} />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" opacity={0.3} />
                <Radar name="DNA" dataKey="A" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.45} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-500/20 text-xs text-purple-950 dark:text-purple-200 space-y-1">
            <p className="font-bold">✨ AI Archetype: Culinary Storyteller</p>
            <p className="text-[11px] opacity-80 leading-relaxed">
              Your itineraries automatically prioritize golden hour photo stops, authentic night alleys, and comfortable 9:30 AM wake-up windows.
            </p>
          </div>
        </div>

        {/* Right: Interactive DNA Sliders */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-500" />
                Fine-Tune Travel DNA Dimensions
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Drag to adjust your travel persona</p>
            </div>

            <button
              onClick={handleSaveDNA}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/25 transition-all flex items-center gap-1.5"
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
              {savedSuccess ? 'DNA Synced!' : 'Save DNA'}
            </button>
          </div>

          <div className="space-y-4">
            {[
              { key: 'foodExplorer' as const, label: '🍜 Food & Culinary Explorer', desc: 'Street markets, ramen counters, authentic tastings' },
              { key: 'photography' as const, label: '📸 Photography & Scenic Views', desc: 'Sunset observatories, architectural perspectives' },
              { key: 'culture' as const, label: '⛩️ Historic Heritage & Shrines', desc: 'Zen gardens, imperial palaces, artisan crafts' },
              { key: 'budgetConscious' as const, label: '💰 Budget Optimization Weight', desc: 'Rail passes, smart ticket bundles, value lodging' },
              { key: 'slowTravel' as const, label: '☕ Slow Rest & Café Pacing', desc: '90-minute afternoon pauses, leisurely morning starts' },
              { key: 'adventure' as const, label: '🧗 Outdoor & Physical Activity', desc: 'Hiking trails, coastal walking, biking routes' }
            ].map(slider => (
              <div key={slider.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-900 dark:text-white">{slider.label}</span>
                  <span className="text-purple-600 dark:text-purple-400">{dnaValues[slider.key]}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={dnaValues[slider.key]}
                  onChange={(e) => handleSliderChange(slider.key, Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <p className="text-[11px] text-slate-400">{slider.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Unlockable Badges & Achievements Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Travel Achievements & Badges
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Gamified milestone rewards earned on your journeys</p>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {achievements.filter(a => a.unlocked).length} / {achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map(ach => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border transition-all ${
                ach.unlocked
                  ? 'bg-amber-500/10 border-amber-500/30 text-slate-900 dark:text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800/60 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{ach.icon}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold truncate">{ach.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{ach.description}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400">
                    +{ach.xpReward} XP
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
