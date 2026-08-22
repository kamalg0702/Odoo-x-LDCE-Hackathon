import React, { useState } from 'react';
import { 
  Compass, MapPin, Sparkles, AlertTriangle, Camera, Bell, 
  Sun, Moon, Users, User as UserIcon, Shield, ChevronDown, 
  Plus, Check, Share2, Bot
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';
import { useTrip } from '../../context/TripContext.tsx';

interface NavbarProps {
  currentTab?: string;
  activeTab?: string;
  setCurrentTab?: (tab: string) => void;
  setActiveTab?: (tab: string) => void;
  onNavigate?: (tab: string) => void;
  onOpenNotifications?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentTab, 
  activeTab, 
  setCurrentTab, 
  setActiveTab, 
  onNavigate,
  onOpenNotifications 
}) => {
  const { user, switchUser, availableUsers } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { 
    trips, activeTrip, setActiveTrip, unreadNotifsCount, 
    setIsCopilotOpen, setIsRescueOpen, setIsPhotoToTripOpen, 
    setIsAgentModeOpen, setIsNotificationsOpen 
  } = useTrip();

  const selectedTab = activeTab || currentTab || 'dashboard';
  const handleNav = (tab: string) => {
    if (setActiveTab) setActiveTab(tab);
    else if (setCurrentTab) setCurrentTab(tab);
    else if (onNavigate) onNavigate(tab);
  };

  const handleOpenNotifs = () => {
    if (onOpenNotifications) onOpenNotifications();
    else setIsNotificationsOpen(true);
  };

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isTripMenuOpen, setIsTripMenuOpen] = useState(false);

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'my-trips', label: 'My Trips' },
    { id: 'planner', label: 'Trip Workspace' },
    { id: 'builder', label: 'Builder' },
    { id: 'discover', label: 'Discover' },
    { id: 'travel-dna', label: 'Travel DNA' },
    { id: 'group', label: 'Group AI' },
    { id: 'admin', label: 'Analytics' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/85 dark:bg-[#0b1120]/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button 
            id="brand-home-btn"
            onClick={() => handleNav('landing')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-0.5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform flex items-center justify-center text-white">
              <Compass className="w-6 h-6 animate-[spin_12s_linear_infinite]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                GlobeTrotter<span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-500/10 dark:bg-blue-400/20 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/20">AI</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">Plan less. Explore more.</p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const isActive = selectedTab === link.id || (link.id === 'group' && selectedTab === 'group-trip');
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleNav(link.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Active Trip Quick Selector */}
          {activeTrip && (
            <div className="relative hidden lg:block">
              <button
                id="active-trip-selector-btn"
                onClick={() => setIsTripMenuOpen(!isTripMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[200px] truncate"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="truncate">{activeTrip.title}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>

              {isTripMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Active Trip
                  </div>
                  {trips.map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setActiveTrip(t);
                        setIsTripMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors ${
                        activeTrip.id === t.id ? 'font-bold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-500/10' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="truncate">{t.title}</span>
                      {activeTrip.id === t.id && <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                    </button>
                  ))}
                  <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1 px-2">
                    <button
                      onClick={() => {
                        setIsTripMenuOpen(false);
                        handleNav('create-trip');
                      }}
                      className="w-full px-2 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Plan New Trip
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 🚨 Trip Rescue Quick Trigger */}
          <button
            id="trip-rescue-header-btn"
            onClick={() => setIsRescueOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/10 dark:bg-amber-400/15 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs font-bold hover:bg-amber-500/20 transition-all shadow-xs shrink-0 cursor-pointer"
            title="Trip Rescue: Instant disruption recovery"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span className="hidden md:inline">Rescue</span>
          </button>

          {/* 📸 Photo to Trip Trigger */}
          <button
            id="photo-to-trip-header-btn"
            onClick={() => setIsPhotoToTripOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-purple-500/10 dark:bg-purple-400/15 border border-purple-500/30 text-purple-600 dark:text-purple-300 text-xs font-bold hover:bg-purple-500/20 transition-all shadow-xs shrink-0 cursor-pointer"
            title="Photo-to-Trip: Generate itinerary from landmark photo"
          >
            <Camera className="w-3.5 h-3.5 text-purple-500" />
            <span className="hidden lg:inline">Photo Trip</span>
          </button>

          {/* 🤖 Autonomous Agent Mode Trigger */}
          <button
            id="agent-mode-header-btn"
            onClick={() => setIsAgentModeOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-500/20 transition-all shadow-xs shrink-0 cursor-pointer"
            title="Agent Mode: Autonomous multi-step operations"
          >
            <Bot className="w-3.5 h-3.5 text-emerald-500" />
            <span>Agent</span>
          </button>

          {/* ✨ Floating AI Copilot Trigger */}
          <button
            id="copilot-header-btn"
            onClick={() => setIsCopilotOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden xs:inline sm:inline">AI Copilot</span>
          </button>

          {/* Notifications Bell */}
          <button
            id="notifications-bell-btn"
            onClick={handleOpenNotifs}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          {/* Theme Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* User Profile & Demo Switcher */}
          <div className="relative">
            <button
              id="user-profile-menu-btn"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-blue-500/30 transition-all"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                  {user?.name?.[0] || 'U'}
                </div>
              )}
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <img src={user?.avatar} alt={user?.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="truncate">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                      🏆 {user?.level || 'Globetrotter'} ({user?.xp} XP)
                    </span>
                  </div>
                </div>

                <div className="py-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1">
                    Switch Demo Persona
                  </p>
                  {availableUsers.map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u);
                        setIsUserMenuOpen(false);
                      }}
                      className={`w-full px-2 py-1.5 rounded-lg text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                        user?.id === u.id ? 'bg-blue-50 dark:bg-blue-500/15 font-bold text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-full object-cover" />
                        <span className="truncate">{u.name} ({u.role})</span>
                      </div>
                      {user?.id === u.id && <Check className="w-3 h-3 text-blue-500 shrink-0" />}
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-2 flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      handleNav('profile');
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center justify-between"
                  >
                    <span>Profile & Settings</span>
                    <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      handleNav('my-trips');
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center justify-between"
                  >
                    <span>My Trips List</span>
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      handleNav('shared-trip');
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center justify-between"
                  >
                    <span>Public Share View</span>
                    <Share2 className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      handleNav('travel-dna');
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  >
                    View My Travel DNA & Stats
                  </button>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      handleNav('admin');
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center justify-between"
                  >
                    <span>Admin Dashboard</span>
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
