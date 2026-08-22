import React from 'react';
import { Home, Compass, MapPin, Sparkles, User as UserIcon, PlusCircle } from 'lucide-react';
import { useTrip } from '../../context/TripContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';

interface MobileNavProps {
  currentTab?: string;
  activeTab?: string;
  setCurrentTab?: (tab: string) => void;
  setActiveTab?: (tab: string) => void;
  onNavigate?: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ 
  currentTab, 
  activeTab, 
  setCurrentTab, 
  setActiveTab,
  onNavigate 
}) => {
  const { setIsCopilotOpen } = useTrip();
  const { user } = useAuth();

  const selectedTab = activeTab || currentTab || 'dashboard';
  const handleNav = (tab: string) => {
    if (setActiveTab) setActiveTab(tab);
    else if (setCurrentTab) setCurrentTab(tab);
    else if (onNavigate) onNavigate(tab);
  };

  const tabs = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'create-trip', label: 'Create', icon: PlusCircle },
    { id: 'my-trips', label: 'My Trips', icon: MapPin },
    { id: 'discover', label: 'Explore', icon: Compass },
    { id: 'profile', label: 'Profile', icon: UserIcon }
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0b1120]/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800/80 px-2 py-1.5 flex items-center justify-around safe-area-bottom shadow-lg"
    >
      {tabs.slice(0, 2).map(t => {
        const Icon = t.icon;
        const isActive = selectedTab === t.id;
        return (
          <button
            key={t.id}
            id={`mobile-tab-${t.id}`}
            onClick={() => handleNav(t.id)}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition-all min-h-[44px] min-w-[48px] cursor-pointer ${
              isActive ? 'text-blue-600 dark:text-blue-400 font-extrabold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-blue-600 dark:text-blue-400' : ''}`} />
            <span className="text-[10px] leading-none">{t.label}</span>
          </button>
        );
      })}

      {/* Floating Center AI Trigger */}
      <button
        id="mobile-copilot-btn"
        onClick={() => setIsCopilotOpen(true)}
        className="flex flex-col items-center justify-center gap-1 -mt-3 text-blue-600 dark:text-blue-400 font-bold min-h-[44px] cursor-pointer active:scale-95"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 ring-4 ring-white dark:ring-[#0b1120]">
          <Sparkles className="w-5 h-5" />
        </div>
        <span className="text-[9px] font-extrabold tracking-wider uppercase text-blue-600 dark:text-blue-400">AI Copilot</span>
      </button>

      {tabs.slice(2).map(t => {
        const Icon = t.icon;
        const isActive = selectedTab === t.id || (t.id === 'my-trips' && (selectedTab === 'planner' || selectedTab === 'builder'));
        return (
          <button
            key={t.id}
            id={`mobile-tab-${t.id}`}
            onClick={() => handleNav(t.id)}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition-all min-h-[44px] min-w-[48px] cursor-pointer ${
              isActive ? 'text-blue-600 dark:text-blue-400 font-extrabold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            {t.id === 'profile' && user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className={`w-5 h-5 rounded-full object-cover border ${isActive ? 'border-blue-500 ring-2 ring-blue-500/40 scale-110' : 'border-slate-300 dark:border-slate-600'}`} 
              />
            ) : (
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-blue-600 dark:text-blue-400' : ''}`} />
            )}
            <span className="text-[10px] leading-none">{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
