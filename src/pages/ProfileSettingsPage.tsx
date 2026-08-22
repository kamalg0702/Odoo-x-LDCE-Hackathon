import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Camera, Globe, DollarSign, 
  Trash2, ShieldCheck, Heart, Sparkles, Check, 
  MapPin, AlertTriangle, ArrowRight, Dna, Save,
  Phone, LogIn, CheckCircle2, AlertCircle, Wand2,
  RotateCcw, Compass, Award, ExternalLink, Sliders,
  Briefcase, Plus, X, Smartphone, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { 
  validateName, 
  validatePhoneNumber, 
  validateEmail, 
  validateCity, 
  formatNameTitleCase, 
  COUNTRY_PHONE_RULES 
} from '../utils/validation.ts';

interface ProfileSettingsPageProps {
  onNavigate: (tab: string) => void;
}

export const ProfileSettingsPage: React.FC<ProfileSettingsPageProps> = ({ onNavigate }) => {
  const { user, updateProfile, deleteAccount, switchUser, availableUsers } = useAuth();

  // Basic Info States
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '+91 98401 23456');
  const [countryCode, setCountryCode] = useState('+91');
  const [homeCity, setHomeCity] = useState(user?.homeCity || 'San Francisco, USA');
  const [currency, setCurrency] = useState(user?.currency || '₹');
  const [language, setLanguage] = useState(user?.language || 'English');
  const [avatar, setAvatar] = useState(user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [showCustomAvatarInput, setShowCustomAvatarInput] = useState(false);
  const [bio, setBio] = useState('Passionate globetrotter exploring cultural landmarks, authentic street foods, and scenic coastal routes.');

  // Visited & Wishlist Places
  const [savedDestinations, setSavedDestinations] = useState<string[]>(
    user?.savedDestinations || ['Tokyo, Japan', 'Paris, France', 'Singapore', 'Amalfi Coast, Italy', 'Kyoto, Japan']
  );
  const [newDestinationInput, setNewDestinationInput] = useState('');

  const [visitedCities, setVisitedCities] = useState<string[]>(
    user?.visitedCities || ['San Francisco', 'Tokyo', 'Rome', 'Chennai', 'Paris']
  );
  const [newVisitedCityInput, setNewVisitedCityInput] = useState('');

  // DNA Sliders
  const [foodExplorer, setFoodExplorer] = useState(user?.travelDNA?.foodExplorer ?? 88);
  const [photography, setPhotography] = useState(user?.travelDNA?.photography ?? 92);
  const [culture, setCulture] = useState(user?.travelDNA?.culture ?? 85);
  const [adventure, setAdventure] = useState(user?.travelDNA?.adventure ?? 80);
  const [budgetConscious, setBudgetConscious] = useState(user?.travelDNA?.budgetConscious ?? 65);
  const [beachLover, setBeachLover] = useState(user?.travelDNA?.beachLover ?? 70);
  const [luxury, setLuxury] = useState(user?.travelDNA?.luxury ?? 75);
  const [slowTravel, setSlowTravel] = useState(user?.travelDNA?.slowTravel ?? 80);

  // Sync state whenever active user updates or changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhoneNumber(user.phoneNumber || '+91 98401 23456');
      setHomeCity(user.homeCity || 'San Francisco, USA');
      setCurrency(user.currency || '₹');
      setLanguage(user.language || 'English');
      setAvatar(user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80');
      if (user.savedDestinations?.length) setSavedDestinations(user.savedDestinations);
      if (user.visitedCities?.length) setVisitedCities(user.visitedCities);
      
      if (user.travelDNA) {
        setFoodExplorer(user.travelDNA.foodExplorer ?? 88);
        setPhotography(user.travelDNA.photography ?? 92);
        setCulture(user.travelDNA.culture ?? 85);
        setAdventure(user.travelDNA.adventure ?? 80);
        setBudgetConscious(user.travelDNA.budgetConscious ?? 65);
        setBeachLover(user.travelDNA.beachLover ?? 70);
        setLuxury(user.travelDNA.luxury ?? 75);
        setSlowTravel(user.travelDNA.slowTravel ?? 80);
      }
    }
  }, [user]);

  // Form feedback state
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmDeleteText, setConfirmDeleteText] = useState('');

  const [touchedName, setTouchedName] = useState(false);
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPhone, setTouchedPhone] = useState(false);

  const nameValidation = validateName(name, true, 'Full Name');
  const emailValidation = validateEmail(email);
  const phoneValidation = validatePhoneNumber(phoneNumber, countryCode);

  const avatarPresets = [
    { label: 'Alex (Adventurer)', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80' },
    { label: 'Rahul (Culture)', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' },
    { label: 'Sarah (Explorer)', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    { label: 'Liam (Backpacker)', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80' },
    { label: 'Elena (Photographer)', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80' },
    { label: 'Maya (Foodie)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' }
  ];

  // Save changes to profile and persist across session
  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setTouchedName(true);
    setTouchedEmail(true);
    setTouchedPhone(true);
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please provide a valid full name.');
      return;
    }

    if (email.trim() && !emailValidation.isValid) {
      setErrorMessage(emailValidation.error || 'Please enter a valid email address.');
      return;
    }

    setIsSaving(true);
    try {
      const formattedName = formatNameTitleCase(name.trim());
      const formattedCity = homeCity.trim() ? formatNameTitleCase(homeCity.trim()) : 'San Francisco, USA';
      
      const updates = {
        name: formattedName,
        email: email.trim().toLowerCase(),
        phoneNumber: phoneNumber.trim(),
        homeCity: formattedCity,
        currency,
        language,
        avatar,
        savedDestinations,
        visitedCities,
        travelDNA: {
          foodExplorer,
          photography,
          culture,
          adventure,
          budgetConscious,
          beachLover,
          luxury,
          slowTravel
        }
      };

      const success = await updateProfile(updates);
      if (success) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      } else {
        setErrorMessage('Failed to save profile changes. Please try again.');
      }
    } catch (err) {
      console.error('Save profile error:', err);
      setErrorMessage('An unexpected error occurred while saving profile.');
    } finally {
      setIsSaving(false);
    }
  };

  // Revert / Reset to user's saved state
  const handleReset = () => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhoneNumber(user.phoneNumber || '+91 98401 23456');
      setHomeCity(user.homeCity || 'San Francisco, USA');
      setCurrency(user.currency || '₹');
      setLanguage(user.language || 'English');
      setAvatar(user.avatar || avatarPresets[0].url);
      setSavedDestinations(user.savedDestinations || ['Tokyo, Japan', 'Paris, France', 'Singapore']);
      setVisitedCities(user.visitedCities || ['San Francisco', 'Tokyo', 'Rome']);
      setErrorMessage('');
      setTouchedName(false);
      setTouchedEmail(false);
      setTouchedPhone(false);
    }
  };

  const handleAddSavedDestination = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newDestinationInput.trim();
    if (!clean) return;
    if (!savedDestinations.includes(clean)) {
      const updated = [...savedDestinations, formatNameTitleCase(clean)];
      setSavedDestinations(updated);
      updateProfile({ savedDestinations: updated });
    }
    setNewDestinationInput('');
  };

  const handleRemoveDestination = (dest: string) => {
    const updated = savedDestinations.filter(d => d !== dest);
    setSavedDestinations(updated);
    updateProfile({ savedDestinations: updated });
  };

  const handleAddVisitedCity = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newVisitedCityInput.trim();
    if (!clean) return;
    if (!visitedCities.includes(clean)) {
      const updated = [...visitedCities, formatNameTitleCase(clean)];
      setVisitedCities(updated);
      updateProfile({ visitedCities: updated });
    }
    setNewVisitedCityInput('');
  };

  const handleRemoveVisitedCity = (city: string) => {
    const updated = visitedCities.filter(c => c !== city);
    setVisitedCities(updated);
    updateProfile({ visitedCities: updated });
  };

  const handleDeleteAccount = async () => {
    if (confirmDeleteText !== 'DELETE') return;
    await deleteAccount();
    setIsDeleteModalOpen(false);
    onNavigate('landing');
  };

  return (
    <div className="space-y-6 sm:space-y-8 py-4 sm:py-6 max-w-6xl mx-auto px-2 sm:px-4">
      
      {/* Header & Device-Adaptive Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Live Traveler Profile
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              Session Synchronized
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Account & Profile Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Update your name, verified phone number, home base, currency, and custom travel DNA. All edits automatically persist across your entire active session.
          </p>
        </div>

        {/* Quick Nav / Status Bar */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
          <button
            type="button"
            onClick={() => onNavigate('create-trip')}
            className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-extrabold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Compass className="w-4 h-4" />
            <span>Create New Trip</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('auth')}
            className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <LogIn className="w-4 h-4 text-blue-500" />
            <span>Switch Account</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-extrabold">Profile Updated & Persisted Successfully!</p>
              <p className="text-[11px] sm:text-xs text-emerald-600 dark:text-emerald-400">
                Your new name ({name}), mobile ({phoneNumber}), and currency preference ({currency}) are stored for this session and future trips.
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => setIsSaved(false)}
            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 text-xs font-bold px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          <p className="text-xs font-bold">{errorMessage}</p>
        </div>
      )}

      {/* 1-Click Fast Profile Switcher Bar (Responsive Flex) */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="font-bold text-slate-800 dark:text-slate-200">1-Click Fast Switch Persona:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {availableUsers.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => {
                switchUser(u);
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 2000);
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                user?.id === u.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
              }`}
            >
              <img src={u.avatar} alt={u.name} className="w-4 h-4 rounded-full object-cover" />
              <span>{u.name}</span>
              {user?.id === u.id && <Check className="w-3 h-3 text-white" />}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Responsive Layout (Form on Left / Live Badge Card on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left Column: Comprehensive Settings Form (Span 8) */}
        <form onSubmit={handleSaveProfile} className="lg:col-span-8 space-y-6">
          
          {/* Section 1: Identity & Credentials */}
          <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span>Personal Identity & Credentials</span>
              </h2>
              <span className="text-[11px] font-semibold text-slate-400">Step 1 of 3</span>
            </div>

            {/* Avatar Selector Grid */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Camera className="w-3.5 h-3.5 text-blue-500" />
                <span>Profile Avatar & Appearance</span>
              </label>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative group">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-blue-500 shadow-md shrink-0"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="flex-1 space-y-2 min-w-[200px]">
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Pick a curated traveler avatar or enter a custom photo URL:
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {avatarPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setAvatar(preset.url);
                          setShowCustomAvatarInput(false);
                        }}
                        title={preset.label}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          avatar === preset.url ? 'border-blue-600 ring-2 ring-blue-500/30 scale-105' : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'
                        }`}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => setShowCustomAvatarInput(!showCustomAvatarInput)}
                      className="px-2.5 py-1.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-[11px] font-bold hover:border-blue-500 hover:text-blue-600 transition-all"
                    >
                      Custom URL
                    </button>
                  </div>
                </div>
              </div>

              {/* Custom Image URL Field */}
              {showCustomAvatarInput && (
                <div className="flex items-center gap-2 pt-2 animate-in fade-in">
                  <input
                    type="url"
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customAvatarUrl.trim()) {
                        setAvatar(customAvatarUrl.trim());
                        setShowCustomAvatarInput(false);
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all cursor-pointer"
                  >
                    Apply URL
                  </button>
                </div>
              )}
            </div>

            {/* Form Fields Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              
              {/* Full Name */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  {touchedName && (
                    <span className={`text-[10px] font-bold flex items-center gap-0.5 ${
                      nameValidation.isValid ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                    }`}>
                      {nameValidation.isValid ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {nameValidation.isValid ? 'Valid' : 'Required'}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    id="profile-name-input"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setTouchedName(true);
                    }}
                    onBlur={() => {
                      setTouchedName(true);
                      if (name.trim()) setName(formatNameTitleCase(name));
                    }}
                    placeholder="e.g. Alex Vance"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-semibold text-slate-900 dark:text-white focus:outline-none transition-all ${
                      touchedName && !nameValidation.isValid ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500'
                    }`}
                  />
                  {name && (
                    <button
                      type="button"
                      onClick={() => setName(formatNameTitleCase(name))}
                      title="Format Title Case"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800 hover:bg-blue-100"
                    >
                      Aa
                    </button>
                  )}
                </div>
              </div>

              {/* Verified Phone Number */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Mobile Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">OTP: 7729</span>
                </div>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-24 sm:w-26 px-2 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+81">🇯🇵 +81</option>
                    <option value="+65">🇸🇬 +65</option>
                    <option value="+61">🇦🇺 +61</option>
                    <option value="+49">🇩🇪 +49</option>
                    <option value="+33">🇫🇷 +33</option>
                    <option value="+971">🇦🇪 +971</option>
                  </select>
                  <div className="relative flex-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      id="profile-phone-input"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        setTouchedPhone(true);
                      }}
                      onBlur={() => setTouchedPhone(true)}
                      placeholder="e.g. 98401 23456"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Email Address */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  {touchedEmail && (
                    <span className={`text-[10px] font-bold flex items-center gap-0.5 ${
                      emailValidation.isValid ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                    }`}>
                      {emailValidation.isValid ? 'Verified' : 'Invalid'}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    id="profile-email-input"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setTouchedEmail(true);
                    }}
                    onBlur={() => setTouchedEmail(true)}
                    placeholder="e.g. rosterguy24@gmail.com"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Home Base / Departure City */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Home Base / Departure City
                  </label>
                  <span className="text-[10px] text-slate-400">For flight origination</span>
                </div>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    id="profile-homecity-input"
                    value={homeCity}
                    onChange={(e) => setHomeCity(e.target.value)}
                    placeholder="e.g. San Francisco, USA or Chennai, India"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Default Currency */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Default Display Currency
                </label>
                <div className="relative">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    id="profile-currency-select"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="₹">₹ INR (Indian Rupee)</option>
                    <option value="$">$ USD (United States Dollar)</option>
                    <option value="€">€ EUR (Euro)</option>
                    <option value="£">£ GBP (British Pound)</option>
                    <option value="¥">¥ JPY (Japanese Yen)</option>
                    <option value="S$">S$ SGD (Singapore Dollar)</option>
                    <option value="A$">A$ AUD (Australian Dollar)</option>
                    <option value="C$">C$ CAD (Canadian Dollar)</option>
                    <option value="AED">AED (UAE Dirham)</option>
                  </select>
                </div>
              </div>

              {/* Platform Language */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Language & Locale
                </label>
                <div className="relative">
                  <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="English">English (United States)</option>
                    <option value="Español">Español (Spanish)</option>
                    <option value="Français">Français (French)</option>
                    <option value="Deutsch">Deutsch (German)</option>
                    <option value="日本語">日本語 (Japanese)</option>
                    <option value="Hindi">हिन्दी (Hindi)</option>
                  </select>
                </div>
              </div>

              {/* Bio / Persona Tagline */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Traveler Bio & Exploration Style
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a short bio about what kinds of trips you love..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

            </div>
          </div>

          {/* Section 2: Travel DNA Personality Sliders */}
          <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Dna className="w-4 h-4" />
                </div>
                <span>Travel DNA Personality Profile</span>
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate('travel-dna')}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Full DNA Analysis</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tune your preferences so AI Copilot, budget optimizers, and route generators automatically tailor trips to your exact travel style.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
              
              {/* Food Explorer */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">🍜 Food Explorer</span>
                  <span className="text-purple-600 dark:text-purple-400 font-mono">{foodExplorer}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={foodExplorer}
                  onChange={(e) => setFoodExplorer(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer h-2"
                />
              </div>

              {/* Photography Focus */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">📸 Photography Focus</span>
                  <span className="text-purple-600 dark:text-purple-400 font-mono">{photography}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={photography}
                  onChange={(e) => setPhotography(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer h-2"
                />
              </div>

              {/* Culture & History */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">🏛️ Culture & History</span>
                  <span className="text-purple-600 dark:text-purple-400 font-mono">{culture}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={culture}
                  onChange={(e) => setCulture(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer h-2"
                />
              </div>

              {/* Adventure & Outdoors */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">🧗 Adventure & Outdoors</span>
                  <span className="text-purple-600 dark:text-purple-400 font-mono">{adventure}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={adventure}
                  onChange={(e) => setAdventure(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer h-2"
                />
              </div>

              {/* Budget vs Luxury */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">💎 Luxury Comfort</span>
                  <span className="text-purple-600 dark:text-purple-400 font-mono">{luxury}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={luxury}
                  onChange={(e) => setLuxury(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer h-2"
                />
              </div>

              {/* Slow Travel Pace */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">☕ Slow Travel / Rest Buffers</span>
                  <span className="text-purple-600 dark:text-purple-400 font-mono">{slowTravel}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={slowTravel}
                  onChange={(e) => setSlowTravel(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer h-2"
                />
              </div>

            </div>
          </div>

          {/* Section 3: Visited Places & Wishlist */}
          <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <Heart className="w-4 h-4" />
                </div>
                <span>Visited Places & Saved Wishlist</span>
              </h2>
            </div>

            {/* Visited Cities */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Visited Cities ({visitedCities.length})
                </label>
                <span className="text-[11px] text-slate-400">Adds to Explorer XP</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newVisitedCityInput}
                  onChange={(e) => setNewVisitedCityInput(e.target.value)}
                  placeholder="Add visited city (e.g. Kyoto, Barcelona)..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddVisitedCity}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 inline mr-1" /> Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {visitedCities.map((city, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700"
                  >
                    <span>{city}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveVisitedCity(city)}
                      className="text-slate-400 hover:text-rose-500 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Saved Wishlist */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Wishlist Destinations ({savedDestinations.length})
                </label>
                <span className="text-[11px] text-slate-400">Auto-suggested in generator</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newDestinationInput}
                  onChange={(e) => setNewDestinationInput(e.target.value)}
                  placeholder="Add bucket list spot (e.g. Reykjavik, Iceland)..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddSavedDestination}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 inline mr-1" /> Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {savedDestinations.map((dest, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-800"
                  >
                    <MapPin className="w-3 h-3 text-blue-500" />
                    <span>{dest}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDestination(dest)}
                      className="text-slate-400 hover:text-rose-500 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Action Bar: Save & Reset Buttons */}
          <div className="sticky bottom-20 md:bottom-4 z-20 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset to Saved</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                id="profile-save-btn"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-extrabold shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving & Persisting...' : 'Save Profile & Preferences'}</span>
              </button>
            </div>
          </div>

        </form>

        {/* Right Column: Live Traveler ID Badge Card & Account Security (Span 4) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
          
          {/* Live Passport & ID Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white border border-slate-700 shadow-xl space-y-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-400">
                <Compass className="w-4 h-4 text-blue-400 animate-spin" />
                <span>Traveler Passport</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Active Session
              </span>
            </div>

            {/* Live Profile Header */}
            <div className="flex items-center gap-3.5 relative z-10">
              <img
                src={avatar}
                alt={name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-400 shadow-md"
              />
              <div className="truncate">
                <h3 className="text-base font-black truncate">{name || 'Traveler Name'}</h3>
                <p className="text-xs text-slate-300 truncate">{email || 'email@example.com'}</p>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-blue-300 font-semibold truncate">
                  <Phone className="w-3 h-3 shrink-0" />
                  <span className="truncate">{countryCode} {phoneNumber}</span>
                </div>
              </div>
            </div>

            {/* Bio quote */}
            {bio && (
              <p className="text-xs text-slate-300 italic line-clamp-2 relative z-10 border-l-2 border-blue-400/40 pl-2.5">
                "{bio}"
              </p>
            )}

            {/* Quick Stat Tiles */}
            <div className="grid grid-cols-2 gap-2 relative z-10 pt-1">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                <p className="text-[10px] uppercase font-bold text-slate-400">Home Base</p>
                <p className="text-xs font-extrabold text-white truncate mt-0.5">{homeCity || 'San Francisco'}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                <p className="text-[10px] uppercase font-bold text-slate-400">Currency</p>
                <p className="text-xs font-extrabold text-white mt-0.5">{currency} Standard</p>
              </div>
            </div>

            {/* Explorer Stats */}
            <div className="p-3 rounded-2xl bg-blue-950/60 border border-blue-800/60 flex items-center justify-between text-xs relative z-10">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <p className="font-extrabold text-white">{user?.level || 'Globetrotter'}</p>
                  <p className="text-[10px] text-slate-400">{user?.xp || 3450} XP Earned</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white/10 text-amber-300">
                Level 12
              </span>
            </div>

            {/* Top DNA Badges */}
            <div className="space-y-1.5 relative z-10">
              <p className="text-[10px] uppercase font-bold text-slate-400">Top DNA Attributes</p>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded-lg bg-white/10 text-[11px] font-semibold text-slate-200">
                  🍜 Foodie {foodExplorer}%
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-white/10 text-[11px] font-semibold text-slate-200">
                  📸 Photo {photography}%
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-white/10 text-[11px] font-semibold text-slate-200">
                  🏛️ Culture {culture}%
                </span>
              </div>
            </div>

          </div>

          {/* Account Security & Danger Zone */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-sm">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Account Security & Privacy</span>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your profile is verified with instant 1-click authentication and simulated SMS OTP verification.
            </p>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button
                type="button"
                onClick={() => onNavigate('my-trips')}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center justify-between px-3 cursor-pointer"
              >
                <span>View My Created Trips</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="w-full py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Account & Purge Data</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Delete Account Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Confirm Account Deletion</h3>
              <p className="text-xs text-slate-500 mt-1">
                Type <strong className="text-rose-600 font-mono">DELETE</strong> in the field below to confirm account purge.
              </p>
            </div>
            <div>
              <input
                type="text"
                value={confirmDeleteText}
                onChange={(e) => setConfirmDeleteText(e.target.value)}
                placeholder="Type DELETE"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-center uppercase text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setConfirmDeleteText('');
                }}
                className="py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={confirmDeleteText !== 'DELETE'}
                onClick={handleDeleteAccount}
                className="py-2.5 rounded-xl bg-rose-600 disabled:opacity-40 text-white text-xs font-bold shadow-md shadow-rose-500/25 cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
