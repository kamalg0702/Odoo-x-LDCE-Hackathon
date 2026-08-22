import React, { useState } from 'react';
import { 
  Users, Heart, ThumbsUp, Sparkles, MessageSquare, 
  Send, UserPlus, CheckCircle2, AlertCircle, Share2, 
  Dna, Flame, ArrowRight 
} from 'lucide-react';
import { useTrip } from '../context/TripContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { GroupMember } from '../types/index.ts';

export const GroupTripPage: React.FC = () => {
  const { activeTrip, updateActiveTripLocally } = useTrip();
  const { user } = useAuth();

  const [commentText, setCommentText] = useState('');
  const [synergyAnalysis, setSynergyAnalysis] = useState<{
    compatibilityScore: number;
    synergies: string[];
    potentialConflicts: string[];
    compromiseSuggestions: string[];
  } | null>({
    compatibilityScore: 88,
    synergies: [
      'Both Rahul and Priya have 90%+ food explorer ratings (High dining synergy)',
      'Shared desire for golden-hour scenic viewpoints in Kyoto and Tokyo'
    ],
    potentialConflicts: [
      'Priya prefers fast-paced walking (4-5 sights/day) vs Rahul who prefers slow afternoon café buffers'
    ],
    compromiseSuggestions: [
      'Allocate 10:00 - 13:00 for shared highlights, schedule 14:00 - 16:30 for flexible self-paced exploration with café rendez-vous at 17:00'
    ]
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const members: GroupMember[] = activeTrip?.members || [
    {
      id: 'm1',
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      role: 'owner',
      status: 'joined',
      travelDNA: {
        foodExplorer: 90,
        beachLover: 70,
        adventure: 75,
        culture: 85,
        photography: 95,
        luxury: 60,
        budgetConscious: 80,
        slowTravel: 65
      }
    },
    {
      id: 'm2',
      name: 'Priya Patel',
      email: 'priya@example.com',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
      role: 'editor',
      status: 'joined',
      travelDNA: {
        foodExplorer: 95,
        beachLover: 85,
        adventure: 60,
        culture: 90,
        photography: 80,
        luxury: 80,
        budgetConscious: 50,
        slowTravel: 40
      }
    }
  ];

  const handleRunSynergy = async () => {
    if (!activeTrip) return;
    setIsAnalyzing(true);
    try {
      const res = await api.analyzeGroupSynergy(activeTrip.id, members);
      setSynergyAnalysis(res);
    } catch (err) {
      console.error('Synergy error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !activeTrip) return;

    try {
      const updated = await api.addComment(activeTrip.id, {
        userId: user?.id || 'user_rahul',
        userName: user?.name || 'Rahul Sharma',
        userAvatar: user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        content: commentText
      });
      updateActiveTripLocally(updated);
      setCommentText('');
    } catch (err) {
      console.error('Add comment error:', err);
    }
  };

  const handleVote = async (itemId: string) => {
    if (!activeTrip) return;
    try {
      const updated = await api.voteActivity(activeTrip.id, itemId);
      updateActiveTripLocally(updated);
    } catch (err) {
      console.error('Vote error:', err);
    }
  };

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Users className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Group Synergy & Consensus Hub
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Resolve travel personality differences, vote on activities, and synchronize shared budgets
          </p>
        </div>

        <button
          onClick={handleRunSynergy}
          disabled={isAnalyzing}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          {isAnalyzing ? 'Calculating Group AI...' : 'Recalculate Synergy'}
        </button>
      </div>

      {/* Group Synergy & Compatibility Score Card */}
      {synergyAnalysis && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/30 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border-2 border-blue-400/50 flex flex-col items-center justify-center text-cyan-300 font-extrabold">
                <span className="text-xl">{synergyAnalysis.compatibilityScore}%</span>
                <span className="text-[9px] uppercase font-bold text-slate-300">Match</span>
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white">
                  Group Personality Compatibility
                </h3>
                <p className="text-xs text-slate-300">
                  Calculated by cross-referencing Travel DNA vectors of {members.length} travelers
                </p>
              </div>
            </div>

            <div className="flex -space-x-3">
              {members.map(m => (
                <img
                  key={m.id}
                  src={m.avatarUrl}
                  alt={m.name}
                  className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover shadow-sm"
                  title={m.name}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Shared Synergies
              </span>
              <ul className="space-y-1 text-xs text-slate-300">
                {synergyAnalysis.synergies.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                AI Compromise Strategy
              </span>
              <ul className="space-y-1 text-xs text-slate-300">
                {synergyAnalysis.compromiseSuggestions.map((c, i) => (
                  <li key={i}>• {c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Activity Voting & Consensus Grid */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Activity Voting & Polling
            </h3>
            <p className="text-xs text-slate-500">Every member can vote to confirm stops</p>
          </div>
          <span className="text-xs font-bold text-blue-500">
            {activeTrip?.items.length || 0} Activities in Ballot
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {activeTrip?.items.slice(0, 4).map(item => (
            <div
              key={item.id}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 uppercase">
                    Day {item.dayNumber}
                  </span>
                  <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {item.title}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{item.locationName} • {activeTrip.currency}{item.cost}</p>
              </div>

              <button
                onClick={() => handleVote(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  item.userVoted
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:text-rose-500'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${item.userVoted ? 'fill-current' : ''}`} />
                <span>{item.votesCount || 0}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Group Discussion Feed */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-500" />
          Group Live Discussion
        </h3>

        <div className="space-y-3 max-h-60 overflow-y-auto">
          {activeTrip?.comments?.map(c => (
            <div key={c.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-start gap-3 text-xs">
              <img
                src={c.userAvatar}
                alt={c.userName}
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">{c.userName}</span>
                  <span className="text-[10px] text-slate-400">{c.createdAt?.split('T')[0]}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5">{c.content}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddComment} className="flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Post a message to your co-travelers..."
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-2xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/25 hover:bg-blue-700 flex items-center gap-1"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>

    </div>
  );
};
