import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, Sparkles, User, Lock, Mail, Phone, 
  ArrowRight, ShieldCheck, CheckCircle2, Eye, EyeOff, X, KeyRound, 
  AlertCircle, Smartphone, Globe, Check, Wand2, Info, Edit3, Settings,
  MapPin, Sliders, RefreshCw, LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { 
  validateName, 
  validatePhoneNumber, 
  validateEmail, 
  validatePassword, 
  validateOtp, 
  validateCity, 
  formatNameTitleCase, 
  COUNTRY_PHONE_RULES 
} from '../utils/validation.ts';

interface AuthPageProps {
  onSuccess: (targetTab?: string) => void;
  onNavigate?: (tab: string) => void;
}

type AuthTab = 'gmail' | 'phone' | 'register';

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onNavigate }) => {
  const { user, login, signup, sendOtp, switchUser, demoUsers, updateProfile } = useAuth();
  
  const [activeTab, setActiveTab] = useState<AuthTab>('gmail');
  
  // Gmail / Email State
  const [email, setEmail] = useState('rosterguy24@gmail.com');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);
  
  // Phone & Name State
  const [phoneName, setPhoneName] = useState('Rahul Sharma');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('9840123456');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [demoOtpHint, setDemoOtpHint] = useState('7729');
  const [otpSentMessage, setOtpSentMessage] = useState('');
  const [touchedPhoneName, setTouchedPhoneName] = useState(false);
  const [touchedPhoneNumber, setTouchedPhoneNumber] = useState(false);
  const [touchedOtp, setTouchedOtp] = useState(false);
  
  // Register State
  const [regName, setRegName] = useState('Alex Vance');
  const [regEmail, setRegEmail] = useState('rosterguy24@gmail.com');
  const [regPhone, setRegPhone] = useState('9840123456');
  const [regCountryCode, setRegCountryCode] = useState('+1');
  const [regHomeCity, setRegHomeCity] = useState('San Francisco, USA');
  const [touchedRegName, setTouchedRegName] = useState(false);
  const [touchedRegEmail, setTouchedRegEmail] = useState(false);
  const [touchedRegPhone, setTouchedRegPhone] = useState(false);
  const [touchedRegHomeCity, setTouchedRegHomeCity] = useState(false);
  
  // General State
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot password modal
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [touchedResetEmail, setTouchedResetEmail] = useState(false);
  const [resetSentMessage, setResetSentMessage] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);

  // Google Demo Account Quick Chooser Modal
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // Profile Edit Quick Modal State
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [editName, setEditName] = useState('Alex Vance');
  const [editEmail, setEditEmail] = useState('rosterguy24@gmail.com');
  const [editPhone, setEditPhone] = useState('9840123456');
  const [editCountryCode, setEditCountryCode] = useState('+1');
  const [editHomeCity, setEditHomeCity] = useState('San Francisco, USA');
  const [editCurrency, setEditCurrency] = useState('$');
  const [editAvatar, setEditAvatar] = useState('https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  const googleDemoAccounts = [
    {
      name: 'Alex Vance (Primary)',
      email: 'rosterguy24@gmail.com',
      phone: '+1 (555) 019-2834',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      badge: 'Verified Google Account'
    },
    {
      name: 'Rahul Sharma',
      email: 'rahul.sharma@gmail.com',
      phone: '+91 98401 23456',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      badge: 'Globetrotter DNA'
    },
    {
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@gmail.com',
      phone: '+44 7911 123456',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      badge: 'World Explorer'
    }
  ];

  const avatarPresets = [
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  ];

  // Quick Preset Chooser for Demo Credentials
  const applyDemoPreset = (preset: { name: string; email: string; phone: string; countryCode: string; city: string; avatar: string }) => {
    setEmail(preset.email);
    setPhoneName(preset.name);
    setPhoneNumber(preset.phone.replace(/\D/g, ''));
    setCountryCode(preset.countryCode);
    setRegName(preset.name);
    setRegEmail(preset.email);
    setRegPhone(preset.phone.replace(/\D/g, ''));
    setRegCountryCode(preset.countryCode);
    setRegHomeCity(preset.city);
    
    // Sync editor state
    setEditName(preset.name);
    setEditEmail(preset.email);
    setEditPhone(preset.phone.replace(/\D/g, ''));
    setEditCountryCode(preset.countryCode);
    setEditHomeCity(preset.city);
    setEditAvatar(preset.avatar);

    setErrorMessage('');
    setSuccessMessage(`Loaded demo credentials for ${preset.name}!`);
    setTimeout(() => setSuccessMessage(''), 2500);
  };

  const handleSaveQuickProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const formattedName = formatNameTitleCase(editName.trim());
      const updatedPhone = `${editCountryCode} ${editPhone.replace(/\D/g, '')}`;
      
      // Update form values
      setEmail(editEmail.trim().toLowerCase());
      setPhoneName(formattedName);
      setPhoneNumber(editPhone.replace(/\D/g, ''));
      setCountryCode(editCountryCode);
      setRegName(formattedName);
      setRegEmail(editEmail.trim().toLowerCase());
      setRegPhone(editPhone.replace(/\D/g, ''));
      setRegCountryCode(editCountryCode);
      setRegHomeCity(editHomeCity);

      await updateProfile({
        name: formattedName,
        email: editEmail.trim().toLowerCase(),
        phoneNumber: updatedPhone,
        homeCity: editHomeCity,
        currency: editCurrency,
        avatar: editAvatar
      });

      setProfileSaveSuccess(true);
      setTimeout(() => {
        setProfileSaveSuccess(false);
        setIsProfileEditOpen(false);
      }, 1200);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Real-time Validations
  const emailValidation = validateEmail(email);
  const passwordValidation = validatePassword(password);
  const phoneNameValidation = validateName(phoneName, true, 'Full Name');
  const phoneNumberValidation = validatePhoneNumber(phoneNumber, countryCode);
  const otpValidation = validateOtp(otpCode, 4);
  const regNameValidation = validateName(regName, true, 'Full Name');
  const regEmailValidation = validateEmail(regEmail);
  const regPhoneValidation = validatePhoneNumber(regPhone, regCountryCode);
  const regHomeCityValidation = validateCity(regHomeCity);
  const resetEmailValidation = validateEmail(resetEmail);

  // Current country phone rules
  const currentPhoneRule = COUNTRY_PHONE_RULES[countryCode] || COUNTRY_PHONE_RULES['+91'];
  const regPhoneRule = COUNTRY_PHONE_RULES[regCountryCode] || COUNTRY_PHONE_RULES['+1'];

  const phoneDigitsCount = phoneNumber.replace(/\D/g, '').length;
  const regPhoneDigitsCount = regPhone.replace(/\D/g, '').length;

  // Handle Gmail / Email Sign In
  const handleGmailSubmit = async (e: React.FormEvent, targetPage: string = 'create-trip') => {
    e.preventDefault();
    setTouchedEmail(true);
    setTouchedPassword(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (!emailValidation.isValid) {
      setErrorMessage(emailValidation.error || 'Please enter a valid email address.');
      return;
    }

    if (!passwordValidation.isValid) {
      setErrorMessage(passwordValidation.error || 'Please enter a valid password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const ok = await login({ email: email.trim().toLowerCase() });
      if (ok) {
        setSuccessMessage('Logged in successfully! Launching trip creator...');
        setTimeout(() => onSuccess(targetPage), 350);
      } else {
        setErrorMessage('Could not sign in with this email. Please check credentials or select a 1-click profile.');
      }
    } catch (err) {
      setErrorMessage('Sign-in failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Phone & Name OTP Send
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouchedPhoneName(true);
    setTouchedPhoneNumber(true);
    setErrorMessage('');
    
    if (!phoneNameValidation.isValid) {
      setErrorMessage(phoneNameValidation.error || 'Please provide a valid formatted name.');
      return;
    }

    if (!phoneNumberValidation.isValid) {
      setErrorMessage(phoneNumberValidation.error || 'Please enter a valid mobile number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedName = formatNameTitleCase(phoneName.trim());
      setPhoneName(formattedName);

      const fullPhone = `${countryCode} ${phoneNumber.replace(/\D/g, '')}`;
      const res = await sendOtp(fullPhone);
      setDemoOtpHint(res.demoOtp || '7729');
      setOtpSentMessage(`Verification code sent to ${fullPhone}. Use Demo OTP: ${res.demoOtp || '7729'}`);
      setOtpStep(true);
      setTouchedOtp(false);
    } catch (err) {
      setErrorMessage('Failed to send verification code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP Verification & Login
  const handleVerifyOtp = async (e: React.FormEvent, targetPage: string = 'create-trip') => {
    e.preventDefault();
    setTouchedOtp(true);
    setErrorMessage('');
    
    if (!otpValidation.isValid) {
      setErrorMessage(otpValidation.error || 'Please enter the 4-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    try {
      const fullPhone = `${countryCode} ${phoneNumber.replace(/\D/g, '')}`;
      const formattedName = formatNameTitleCase(phoneName.trim());
      const ok = await login({ 
        phoneNumber: fullPhone, 
        name: formattedName 
      });
      if (ok) {
        setSuccessMessage(`Welcome back, ${formattedName}! Launching trip creator...`);
        setTimeout(() => onSuccess(targetPage), 350);
      } else {
        setErrorMessage('Verification failed. Try clicking Auto-fill Demo Code.');
      }
    } catch (err) {
      setErrorMessage('Authentication error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Registration Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouchedRegName(true);
    setTouchedRegEmail(true);
    setTouchedRegPhone(true);
    setTouchedRegHomeCity(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (!regNameValidation.isValid) {
      setErrorMessage(regNameValidation.error || 'Please provide your full name.');
      return;
    }
    if (!regEmailValidation.isValid) {
      setErrorMessage(regEmailValidation.error || 'Please enter a valid email address.');
      return;
    }
    if (!regPhoneValidation.isValid) {
      setErrorMessage(regPhoneValidation.error || 'Please provide a valid phone number.');
      return;
    }
    if (!regHomeCityValidation.isValid) {
      setErrorMessage(regHomeCityValidation.error || 'Please provide your home departure city.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedName = formatNameTitleCase(regName.trim());
      const formattedCity = formatNameTitleCase(regHomeCity.trim());
      const fullPhone = `${regCountryCode} ${regPhone.replace(/\D/g, '')}`;
      
      const ok = await signup(formattedName, regEmail.trim().toLowerCase(), formattedCity, fullPhone);
      if (ok) {
        setSuccessMessage(`Welcome ${formattedName}! Account created. Launching trip creator...`);
        setTimeout(() => onSuccess('create-trip'), 400);
      } else {
        setErrorMessage('Could not register account. Please check details.');
      }
    } catch (err) {
      setErrorMessage('Registration error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle 1-Click Google Account Selection
  const handleSelectGoogleAccount = async (account: typeof googleDemoAccounts[0]) => {
    setIsSubmitting(true);
    setIsGoogleModalOpen(false);
    try {
      const ok = await login({ email: account.email, name: account.name, phoneNumber: account.phone });
      if (ok) {
        setSuccessMessage(`Signed in with Google as ${account.name}! Opening trip creator...`);
        setTimeout(() => onSuccess('create-trip'), 300);
      }
    } catch (err) {
      setErrorMessage('Google Sign-In failed. Please try standard login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouchedResetEmail(true);
    if (!resetEmailValidation.isValid) {
      return;
    }

    setIsSendingReset(true);
    try {
      const res = await api.forgotPassword(resetEmail.trim());
      setResetSentMessage(res.message || 'Password reset link sent to your email.');
    } catch (err) {
      setResetSentMessage('Instructions sent! Check your inbox.');
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleSelectDemoUser = (userItem: any) => {
    switchUser(userItem);
    onSuccess();
  };

  // Helper function to get input styling classes based on validation state
  const getInputClasses = (isTouched: boolean, isValid: boolean) => {
    if (!isTouched) {
      return 'border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white';
    }
    if (isValid) {
      return 'border-emerald-500 dark:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10 text-slate-900 dark:text-white';
    }
    return 'border-rose-400 dark:border-rose-500 focus:ring-2 focus:ring-rose-500 bg-rose-50/30 dark:bg-rose-950/20 text-slate-900 dark:text-white';
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Main Auth Container */}
      <div className="rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Side: Brand Showcase & Quick 1-Click Access (5 cols) */}
        <div className="md:col-span-5 p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '14s' }} />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight block leading-tight">GlobeTrotter AI</span>
                <span className="text-[10px] text-cyan-300 font-medium tracking-wide">Multi-City Travel Intelligence</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              Autonomous itineraries, real-time route optimization, weather-adaptive replanning, and group budget balancing.
            </p>
          </div>

          <div className="space-y-3 py-2">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <span>Google / Gmail 1-Click Demo Login</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <span>Mobile Phone Number + Name Verification</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <span>Standard Format & Real-Time Input Checks</span>
            </div>
          </div>

          {/* Quick Demo Persona Switcher */}
          <div className="space-y-2 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
                Instant Demo Profiles:
              </p>
              <span className="text-[10px] text-slate-400">1-Click Sign In</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {demoUsers.slice(0, 3).map(u => (
                <button
                  key={u.id}
                  type="button"
                  id={`demo-user-btn-${u.id}`}
                  onClick={() => handleSelectDemoUser(u)}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-left text-xs transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <img 
                      src={u.avatar} 
                      alt={u.name} 
                      className="w-7 h-7 rounded-full object-cover border border-white/30 shrink-0" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="truncate">
                      <p className="font-bold text-white text-xs truncate group-hover:text-cyan-200">{u.name}</p>
                      <p className="text-[10px] text-slate-300 truncate">{u.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/30 text-cyan-200 shrink-0 ml-2">
                    {u.role === 'admin' ? 'Admin' : u.level || 'Traveler'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Google-Style Clean Auth Card (7 cols) */}
        <div className="md:col-span-7 p-6 sm:p-10 space-y-5 flex flex-col justify-between bg-white dark:bg-slate-900">
          <div>
            {/* Google-Inspired Header */}
            <div className="space-y-1 mb-5">
              <div className="flex items-center gap-2">
                {/* Google Multicolor Indicator */}
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Authentication Portal
                </span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                >
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {activeTab === 'gmail' && 'Sign in with Gmail or Email'}
                    {activeTab === 'phone' && 'Sign in with Phone & Name'}
                    {activeTab === 'register' && 'Create New Traveler Account'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {activeTab === 'gmail' && 'Access all your multi-city journeys, AI itinerary builders, and saved budgets.'}
                    {activeTab === 'phone' && 'Quick mobile access with formatted traveler name and instant OTP verification.'}
                    {activeTab === 'register' && 'Set up your traveler profile with custom DNA, currency, and verified credentials.'}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Demo Credentials Quick Switcher & Profile Edit Option Banner */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-cyan-500/10 border border-blue-500/20 mb-4 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  <span>Demo Credentials Active</span>
                </div>
                <button
                  type="button"
                  id="auth-profile-edit-option-btn"
                  onClick={() => setIsProfileEditOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer hover:shadow-sm"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Profile Edit Option</span>
                </button>
              </div>

              {/* Quick Persona Autofill Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  id="auth-quick-demo-alex-btn"
                  onClick={() => applyDemoPreset({
                    name: 'Alex Vance',
                    email: 'rosterguy24@gmail.com',
                    phone: '5550192834',
                    countryCode: '+1',
                    city: 'San Francisco, USA',
                    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80'
                  })}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-800 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Mail className="w-3 h-3 text-blue-500" />
                  <span>rosterguy24@gmail.com (Alex)</span>
                </button>
                <button
                  type="button"
                  id="auth-quick-demo-rahul-btn"
                  onClick={() => applyDemoPreset({
                    name: 'Rahul Sharma',
                    email: 'rahul.sharma@gmail.com',
                    phone: '9840123456',
                    countryCode: '+91',
                    city: 'Chennai, India',
                    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
                  })}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-800 dark:text-slate-200 hover:border-indigo-500 hover:text-indigo-600 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Phone className="w-3 h-3 text-indigo-500" />
                  <span>+91 98401 23456 (Rahul)</span>
                </button>
                <button
                  type="button"
                  id="auth-quick-demo-sarah-btn"
                  onClick={() => applyDemoPreset({
                    name: 'Sarah Jenkins',
                    email: 'sarah.jenkins@gmail.com',
                    phone: '7911123456',
                    countryCode: '+44',
                    city: 'London, UK',
                    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
                  })}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-800 dark:text-slate-200 hover:border-cyan-500 hover:text-cyan-600 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <User className="w-3 h-3 text-cyan-500" />
                  <span>Sarah Jenkins (+44)</span>
                </button>
              </div>
            </div>

            {/* Quick 1-Click Google Button */}
            <button
              type="button"
              id="auth-google-popup-btn"
              onClick={() => setIsGoogleModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2.5 shadow-xs hover:shadow cursor-pointer"
            >
              {/* Google G SVG */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google / Gmail (1-Click Demo)</span>
            </button>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-slate-200 dark:border-slate-800" />
              <span className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">or sign in with</span>
              <div className="flex-1 border-t border-slate-200 dark:border-slate-800" />
            </div>

            {/* Navigation Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4 text-xs font-bold relative">
              <button
                type="button"
                id="auth-tab-gmail-btn"
                onClick={() => { setActiveTab('gmail'); setErrorMessage(''); setSuccessMessage(''); }}
                className={`relative py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer z-10 ${
                  activeTab === 'gmail' 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {activeTab === 'gmail' && (
                  <motion.div
                    layoutId="activeAuthTab"
                    className="absolute inset-0 bg-white dark:bg-slate-700 rounded-lg shadow-xs -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <Mail className="w-3.5 h-3.5" />
                <span>Gmail / Email</span>
              </button>
              <button
                type="button"
                id="auth-tab-phone-btn"
                onClick={() => { setActiveTab('phone'); setErrorMessage(''); setSuccessMessage(''); }}
                className={`relative py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer z-10 ${
                  activeTab === 'phone' 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {activeTab === 'phone' && (
                  <motion.div
                    layoutId="activeAuthTab"
                    className="absolute inset-0 bg-white dark:bg-slate-700 rounded-lg shadow-xs -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <Phone className="w-3.5 h-3.5" />
                <span>Phone & Name</span>
              </button>
              <button
                type="button"
                id="auth-tab-register-btn"
                onClick={() => { setActiveTab('register'); setErrorMessage(''); setSuccessMessage(''); }}
                className={`relative py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer z-10 ${
                  activeTab === 'register' 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {activeTab === 'register' && (
                  <motion.div
                    layoutId="activeAuthTab"
                    className="absolute inset-0 bg-white dark:bg-slate-700 rounded-lg shadow-xs -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <User className="w-3.5 h-3.5" />
                <span>New Account</span>
              </button>
            </div>

            {/* Error & Success Messages */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -6 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden mb-4"
                >
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                </motion.div>
              )}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -6 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden mb-4"
                >
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* TAB CONTENT WITH FLUID MOTION TRANSITIONS */}
            <AnimatePresence mode="wait">
              {/* TAB 1: GMAIL / EMAIL LOGIN */}
              {activeTab === 'gmail' && (
                <motion.div
                  key="tab-gmail"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <form onSubmit={handleGmailSubmit} className="space-y-3.5">
                    {/* Email Field */}
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Gmail or Email Address
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setEmail('rosterguy24@gmail.com');
                            setTouchedEmail(true);
                            setErrorMessage('');
                          }}
                          className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                        >
                          Fill demo Gmail
                        </button>
                      </div>
                      <div className="relative mt-1">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          id="auth-gmail-input"
                          required
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setTouchedEmail(true);
                            if (errorMessage) setErrorMessage('');
                          }}
                          onBlur={() => setTouchedEmail(true)}
                          placeholder="e.g. rosterguy24@gmail.com"
                          className={`w-full pl-9 pr-8 py-2.5 rounded-xl border text-xs font-medium focus:outline-none transition-all ${getInputClasses(touchedEmail, emailValidation.isValid)}`}
                        />
                        {touchedEmail && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {emailValidation.isValid ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-rose-500" />
                            )}
                          </div>
                        )}
                      </div>
                      {/* Real-time Email Feedback */}
                      {touchedEmail && !emailValidation.isValid && (
                        <p className="mt-1 text-[11px] font-medium text-rose-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{emailValidation.error}</span>
                        </p>
                      )}
                      {touchedEmail && emailValidation.isValid && (
                        <p className="mt-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Valid email format</span>
                        </p>
                      )}
                    </div>

                    {/* Password Field */}
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
                        <button
                          type="button"
                          id="auth-forgot-password-btn"
                          onClick={() => {
                            setResetEmail(email);
                            setTouchedResetEmail(false);
                            setIsForgotPasswordOpen(true);
                            setResetSentMessage('');
                          }}
                          className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative mt-1">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="auth-password-input"
                          required
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setTouchedPassword(true);
                            if (errorMessage) setErrorMessage('');
                          }}
                          onBlur={() => setTouchedPassword(true)}
                          placeholder="••••••••"
                          className={`w-full pl-9 pr-16 py-2.5 rounded-xl border text-xs font-medium focus:outline-none transition-all ${getInputClasses(touchedPassword, passwordValidation.isValid)}`}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                          {touchedPassword && (
                            passwordValidation.isValid ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                            )
                          )}
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-slate-400 hover:text-slate-600 cursor-pointer"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      {/* Real-time Password Feedback */}
                      {touchedPassword && !passwordValidation.isValid && (
                        <p className="mt-1 text-[11px] font-medium text-rose-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{passwordValidation.error}</span>
                        </p>
                      )}
                      {touchedPassword && passwordValidation.isValid && (
                        <div className="mt-1 flex items-center justify-between text-[11px]">
                          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Valid password length</span>
                          </span>
                          <span className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${
                            passwordValidation.strength === 'strong' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' :
                            passwordValidation.strength === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' :
                            'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}>
                            Strength: {passwordValidation.strength}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 pt-1">
                      <button
                        type="submit"
                        id="auth-gmail-submit-btn"
                        disabled={isSubmitting}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-extrabold shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer active:scale-98"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isSubmitting ? 'Verifying Account...' : 'Sign In & Create New Trip'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleGmailSubmit(e, 'dashboard')}
                        disabled={isSubmitting}
                        className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Sign In to Dashboard Overview</span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* TAB 2: PHONE & NAME LOGIN */}
              {activeTab === 'phone' && (
                <motion.div
                  key="tab-phone"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <AnimatePresence mode="wait">
                    {!otpStep ? (
                      <motion.form
                        key="phone-step-details"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.18 }}
                        onSubmit={handleSendOtp} 
                        className="space-y-3.5"
                      >
                        {/* Full Name Field with formatting */}
                        <div>
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              Your Full Name
                            </label>
                            {phoneName && (
                              <button
                                type="button"
                                onClick={() => {
                                  setPhoneName(formatNameTitleCase(phoneName));
                                  setTouchedPhoneName(true);
                                }}
                                className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                              >
                                <Wand2 className="w-2.5 h-2.5" />
                                <span>Auto-Capitalize</span>
                              </button>
                            )}
                          </div>
                          <div className="relative mt-1">
                            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              id="auth-phone-name-input"
                              required
                              value={phoneName}
                              onChange={(e) => {
                                setPhoneName(e.target.value);
                                setTouchedPhoneName(true);
                                if (errorMessage) setErrorMessage('');
                              }}
                              onBlur={() => {
                                setTouchedPhoneName(true);
                                if (phoneName.trim()) {
                                  setPhoneName(formatNameTitleCase(phoneName.trim()));
                                }
                              }}
                              placeholder="e.g. Rahul Sharma"
                              className={`w-full pl-9 pr-8 py-2.5 rounded-xl border text-xs font-medium focus:outline-none transition-all ${getInputClasses(touchedPhoneName, phoneNameValidation.isValid)}`}
                            />
                            {touchedPhoneName && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {phoneNameValidation.isValid ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-rose-500" />
                                )}
                              </div>
                            )}
                          </div>
                          {/* Name Validation Real-Time Feedback */}
                          {touchedPhoneName && !phoneNameValidation.isValid && (
                            <p className="mt-1 text-[11px] font-medium text-rose-500 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 shrink-0" />
                              <span>{phoneNameValidation.error}</span>
                            </p>
                          )}
                          {touchedPhoneName && phoneNameValidation.isValid && phoneNameValidation.warning && (
                            <p className="mt-1 text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                              <Info className="w-3 h-3 shrink-0" />
                              <span>{phoneNameValidation.warning}</span>
                            </p>
                          )}
                          {touchedPhoneName && phoneNameValidation.isValid && !phoneNameValidation.warning && (
                            <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 shrink-0" />
                              <span>Name properly formatted</span>
                            </p>
                          )}
                        </div>

                        {/* Mobile Phone Number Field */}
                        <div>
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              Mobile Phone Number
                            </label>
                            <button
                              type="button"
                              onClick={() => { 
                                setCountryCode('+91'); 
                                setPhoneNumber('9840123456'); 
                                setPhoneName('Rahul Sharma'); 
                                setTouchedPhoneNumber(true);
                                setTouchedPhoneName(true);
                                setErrorMessage('');
                              }}
                              className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                            >
                              Fill demo mobile (+91)
                            </button>
                          </div>

                          <div className="mt-1 flex gap-2">
                            {/* Country Calling Code Selector */}
                            <select
                              value={countryCode}
                              onChange={(e) => {
                                setCountryCode(e.target.value);
                                setTouchedPhoneNumber(true);
                              }}
                              id="auth-phone-country-select"
                              aria-label="Country calling code"
                              className="w-28 px-2 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            >
                              {Object.values(COUNTRY_PHONE_RULES).map(rule => (
                                <option key={rule.code} value={rule.code}>
                                {rule.flag} {rule.code}
                                </option>
                              ))}
                            </select>

                            {/* Phone Number Input */}
                            <div className="relative flex-1">
                              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                              <input
                                type="tel"
                                id="auth-phone-number-input"
                                required
                                value={phoneNumber}
                                onChange={(e) => {
                                  // Accept digits and standard phone formatting
                                  const val = e.target.value;
                                  setPhoneNumber(val);
                                  setTouchedPhoneNumber(true);
                                  if (errorMessage) setErrorMessage('');
                                }}
                                onBlur={() => setTouchedPhoneNumber(true)}
                                placeholder={currentPhoneRule.placeholder}
                                className={`w-full pl-9 pr-14 py-2.5 rounded-xl border text-xs font-medium focus:outline-none transition-all ${getInputClasses(touchedPhoneNumber, phoneNumberValidation.isValid)}`}
                              />
                              
                              {/* Live Digit Counter Badge */}
                              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-bold">
                                <span className={`px-1.5 py-0.5 rounded-md ${
                                  phoneNumberValidation.isValid 
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' 
                                    : phoneDigitsCount > 0 
                                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' 
                                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                                }`}>
                                  {phoneDigitsCount}d
                                </span>
                                {touchedPhoneNumber && (
                                  phoneNumberValidation.isValid ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                  ) : (
                                    <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                                  )
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Phone Validation Real-Time Feedback */}
                          {touchedPhoneNumber && !phoneNumberValidation.isValid && (
                            <p className="mt-1 text-[11px] font-medium text-rose-500 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 shrink-0" />
                              <span>{phoneNumberValidation.error}</span>
                            </p>
                          )}
                          {touchedPhoneNumber && phoneNumberValidation.isValid && (
                            <div className="mt-1 flex items-center justify-between text-[11px]">
                              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 shrink-0" />
                                <span>Standard length valid for {currentPhoneRule.name}</span>
                              </span>
                              <span className="text-[10px] text-slate-400">
                                E.164: {phoneNumberValidation.formattedValue}
                              </span>
                            </div>
                          )}
                        </div>

                        <button
                          type="submit"
                          id="auth-send-otp-btn"
                          disabled={isSubmitting}
                          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 mt-2 cursor-pointer"
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>{isSubmitting ? 'Generating Verification Code...' : 'Send Verification OTP'}</span>
                        </button>
                      </motion.form>
                    ) : (
                      <motion.form
                        key="otp-step-verify"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.18 }}
                        onSubmit={handleVerifyOtp} 
                        className="space-y-4"
                      >
                        <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-xs space-y-1">
                          <div className="flex items-center justify-between text-blue-700 dark:text-blue-300 font-bold">
                            <span className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-blue-500" />
                              Code Dispatched
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setOtpStep(false);
                                setOtpCode('');
                                setTouchedOtp(false);
                              }}
                              className="text-[11px] underline hover:text-blue-600 cursor-pointer"
                            >
                              Change Number
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300">
                            {otpSentMessage || `Code sent to ${countryCode} ${phoneNumber}`}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              Enter 4-Digit OTP Code
                            </label>
                            <button
                              type="button"
                              id="auth-autofill-otp-btn"
                              onClick={() => {
                                setOtpCode(demoOtpHint);
                                setTouchedOtp(true);
                                setErrorMessage('');
                              }}
                              className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Sparkles className="w-3 h-3" />
                              Auto-fill Demo Code ({demoOtpHint})
                            </button>
                          </div>
                          <div className="relative mt-1">
                            <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              inputMode="numeric"
                              id="auth-otp-input"
                              maxLength={6}
                              required
                              value={otpCode}
                              onChange={(e) => {
                                // Only allow numeric digits
                                const val = e.target.value.replace(/\D/g, '');
                                setOtpCode(val);
                                setTouchedOtp(true);
                                if (errorMessage) setErrorMessage('');
                              }}
                              onBlur={() => setTouchedOtp(true)}
                              placeholder="e.g. 7729"
                              className={`w-full pl-9 pr-8 py-2.5 rounded-xl border text-sm font-black tracking-widest text-center focus:outline-none transition-all ${getInputClasses(touchedOtp, otpValidation.isValid)}`}
                            />
                            {touchedOtp && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {otpValidation.isValid ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-rose-500" />
                                )}
                              </div>
                            )}
                          </div>

                          {/* OTP Real-Time Feedback */}
                          {touchedOtp && !otpValidation.isValid && (
                            <p className="mt-1 text-[11px] font-medium text-rose-500 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 shrink-0" />
                              <span>{otpValidation.error}</span>
                            </p>
                          )}
                          {touchedOtp && otpValidation.isValid && (
                            <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 shrink-0" />
                              <span>4-digit verification code ready</span>
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setOtpStep(false)}
                            className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            id="auth-verify-otp-btn"
                            disabled={isSubmitting}
                            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold shadow-md shadow-emerald-500/25 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer active:scale-98"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{isSubmitting ? 'Verifying Code...' : 'Verify OTP & Create Trip'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* TAB 3: REGISTER NEW ACCOUNT */}
              {activeTab === 'register' && (
                <motion.div
                  key="tab-register"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <form onSubmit={handleRegisterSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* Name Input */}
                      <div>
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                          {regName && (
                            <button
                              type="button"
                              onClick={() => {
                                setRegName(formatNameTitleCase(regName));
                                setTouchedRegName(true);
                              }}
                              className="text-[9px] text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                            >
                              Capitalize
                            </button>
                          )}
                        </div>
                        <div className="relative mt-1">
                          <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            id="auth-register-name-input"
                            required
                            value={regName}
                            onChange={(e) => {
                              setRegName(e.target.value);
                              setTouchedRegName(true);
                              if (errorMessage) setErrorMessage('');
                            }}
                            onBlur={() => {
                              setTouchedRegName(true);
                              if (regName.trim()) {
                                setRegName(formatNameTitleCase(regName.trim()));
                              }
                            }}
                            placeholder="Alex Vance"
                            className={`w-full pl-8 pr-7 py-2 rounded-xl border text-xs font-medium focus:outline-none transition-all ${getInputClasses(touchedRegName, regNameValidation.isValid)}`}
                          />
                          {touchedRegName && (
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                              {regNameValidation.isValid ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                              )}
                            </div>
                          )}
                        </div>
                        {touchedRegName && !regNameValidation.isValid && (
                          <p className="mt-0.5 text-[10px] text-rose-500 flex items-center gap-1">
                            <AlertCircle className="w-2.5 h-2.5 shrink-0" />
                            <span>{regNameValidation.error}</span>
                          </p>
                        )}
                      </div>

                      {/* Phone Input */}
                      <div>
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Phone Number</label>
                          <select
                            value={regCountryCode}
                            onChange={(e) => setRegCountryCode(e.target.value)}
                            className="text-[10px] font-bold bg-transparent text-slate-500 cursor-pointer"
                          >
                            {Object.values(COUNTRY_PHONE_RULES).map(r => (
                              <option key={r.code} value={r.code}>{r.flag} {r.code}</option>
                            ))}
                          </select>
                        </div>
                        <div className="relative mt-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            id="auth-register-phone-input"
                            required
                            value={regPhone}
                            onChange={(e) => {
                              setRegPhone(e.target.value);
                              setTouchedRegPhone(true);
                              if (errorMessage) setErrorMessage('');
                            }}
                            onBlur={() => setTouchedRegPhone(true)}
                            placeholder={regPhoneRule.placeholder}
                            className={`w-full pl-8 pr-12 py-2 rounded-xl border text-xs font-medium focus:outline-none transition-all ${getInputClasses(touchedRegPhone, regPhoneValidation.isValid)}`}
                          />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[9px] font-bold">
                            <span className={`px-1 py-0.2 rounded ${
                              regPhoneValidation.isValid ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 bg-slate-100'
                            }`}>
                              {regPhoneDigitsCount}d
                            </span>
                          </div>
                        </div>
                        {touchedRegPhone && !regPhoneValidation.isValid && (
                          <p className="mt-0.5 text-[10px] text-rose-500 flex items-center gap-1">
                            <AlertCircle className="w-2.5 h-2.5 shrink-0" />
                            <span>{regPhoneValidation.error}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Email Input */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Gmail or Email Address
                      </label>
                      <div className="relative mt-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          id="auth-register-email-input"
                          required
                          value={regEmail}
                          onChange={(e) => {
                            setRegEmail(e.target.value);
                            setTouchedRegEmail(true);
                            if (errorMessage) setErrorMessage('');
                          }}
                          onBlur={() => setTouchedRegEmail(true)}
                          placeholder="alex.vance@gmail.com"
                          className={`w-full pl-8 pr-7 py-2 rounded-xl border text-xs font-medium focus:outline-none transition-all ${getInputClasses(touchedRegEmail, regEmailValidation.isValid)}`}
                        />
                        {touchedRegEmail && (
                          <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                            {regEmailValidation.isValid ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                            )}
                          </div>
                        )}
                      </div>
                      {touchedRegEmail && !regEmailValidation.isValid && (
                        <p className="mt-0.5 text-[10px] text-rose-500 flex items-center gap-1">
                          <AlertCircle className="w-2.5 h-2.5 shrink-0" />
                          <span>{regEmailValidation.error}</span>
                        </p>
                      )}
                    </div>

                    {/* Home City Input */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Home Departure City
                      </label>
                      <div className="relative mt-1">
                        <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          id="auth-register-city-input"
                          required
                          value={regHomeCity}
                          onChange={(e) => {
                            setRegHomeCity(e.target.value);
                            setTouchedRegHomeCity(true);
                            if (errorMessage) setErrorMessage('');
                          }}
                          onBlur={() => {
                            setTouchedRegHomeCity(true);
                            if (regHomeCity.trim()) {
                              setRegHomeCity(formatNameTitleCase(regHomeCity.trim()));
                            }
                          }}
                          placeholder="San Francisco, USA"
                          className={`w-full pl-8 pr-7 py-2 rounded-xl border text-xs font-medium focus:outline-none transition-all ${getInputClasses(touchedRegHomeCity, regHomeCityValidation.isValid)}`}
                        />
                        {touchedRegHomeCity && (
                          <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                            {regHomeCityValidation.isValid ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                            )}
                          </div>
                        )}
                      </div>
                      {touchedRegHomeCity && !regHomeCityValidation.isValid && (
                        <p className="mt-0.5 text-[10px] text-rose-500 flex items-center gap-1">
                          <AlertCircle className="w-2.5 h-2.5 shrink-0" />
                          <span>{regHomeCityValidation.error}</span>
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      id="auth-register-submit-btn"
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-xs font-extrabold shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 mt-2 cursor-pointer active:scale-98"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Creating Profile...' : '✨ Create Account & Start New Trip'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Note & Quick Action Links */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-[11px] text-slate-400">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                AES-256 Mock Encrypted
              </span>
              <button
                type="button"
                id="auth-footer-open-profile-btn"
                onClick={() => setIsProfileEditOpen(true)}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>Profile Edit Option</span>
              </button>
            </div>
            
            {onNavigate && (
              <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                <button
                  type="button"
                  onClick={() => onNavigate('explore')}
                  className="hover:text-blue-500 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Compass className="w-3 h-3" />
                  <span>Preview Workspace without Login</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('profile')}
                  className="hover:text-blue-500 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Settings className="w-3 h-3" />
                  <span>Full Profile Settings</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Profile Edit Quick Modal */}
      <AnimatePresence>
        {isProfileEditOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 my-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Profile Edit Option</h3>
                    <p className="text-[11px] text-slate-500">Edit credentials, demo identity, & mobile number</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsProfileEditOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 1-Click Quick Preset Buttons */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Quick Autofill Presets:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditName('Alex Vance');
                      setEditEmail('rosterguy24@gmail.com');
                      setEditPhone('5550192834');
                      setEditCountryCode('+1');
                      setEditHomeCity('San Francisco, USA');
                      setEditCurrency('$');
                      setEditAvatar('https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80');
                    }}
                    className="p-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-left text-xs hover:border-blue-500 transition-all cursor-pointer"
                  >
                    <p className="font-bold text-slate-900 dark:text-white text-[11px]">Alex Vance</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">rosterguy24@gmail.com</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditName('Rahul Sharma');
                      setEditEmail('rahul.sharma@gmail.com');
                      setEditPhone('9840123456');
                      setEditCountryCode('+91');
                      setEditHomeCity('Chennai, India');
                      setEditCurrency('₹');
                      setEditAvatar('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80');
                    }}
                    className="p-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-left text-xs hover:border-indigo-500 transition-all cursor-pointer"
                  >
                    <p className="font-bold text-slate-900 dark:text-white text-[11px]">Rahul Sharma</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">+91 98401 23456</p>
                  </button>
                </div>
              </div>

              {profileSaveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Profile updated and synced with login forms!</span>
                </div>
              )}

              {/* Edit Form */}
              <form onSubmit={handleSaveQuickProfile} className="space-y-3">
                {/* Full Name */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Traveler Full Name</label>
                    {editName && (
                      <button
                        type="button"
                        onClick={() => setEditName(formatNameTitleCase(editName))}
                        className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        <Wand2 className="w-2.5 h-2.5" />
                        <span>Format Name</span>
                      </button>
                    )}
                  </div>
                  <div className="relative mt-1">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={() => {
                        if (editName.trim()) setEditName(formatNameTitleCase(editName.trim()));
                      }}
                      placeholder="e.g. Alex Vance"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                  <div className="relative mt-1">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      placeholder="rosterguy24@gmail.com"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Mobile Phone & Country Code */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Mobile Phone Number</label>
                  <div className="grid grid-cols-12 gap-2 mt-1">
                    <div className="col-span-4">
                      <select
                        value={editCountryCode}
                        onChange={(e) => setEditCountryCode(e.target.value)}
                        className="w-full px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        {Object.entries(COUNTRY_PHONE_RULES).map(([code, rule]) => (
                          <option key={code} value={code}>
                            {rule.flag} {code}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-8 relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="9840123456"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Home City & Currency */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Home City</label>
                    <div className="relative mt-1">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={editHomeCity}
                        onChange={(e) => setEditHomeCity(e.target.value)}
                        placeholder="San Francisco, USA"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Currency</label>
                    <select
                      value={editCurrency}
                      onChange={(e) => setEditCurrency(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="$">USD ($)</option>
                      <option value="₹">INR (₹)</option>
                      <option value="€">EUR (€)</option>
                      <option value="£">GBP (£)</option>
                      <option value="¥">JPY (¥)</option>
                      <option value="S$">SGD (S$)</option>
                    </select>
                  </div>
                </div>

                {/* Avatar Presets */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Select Avatar Preset
                  </label>
                  <div className="flex items-center gap-2">
                    {avatarPresets.map((av, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditAvatar(av)}
                        className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                          editAvatar === av ? 'border-blue-500 ring-2 ring-blue-400/40 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={av} alt="Avatar option" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  {onNavigate && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileEditOpen(false);
                        onNavigate('profile');
                      }}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>Full Settings Page</span>
                    </button>
                  )}
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      type="button"
                      onClick={() => setIsProfileEditOpen(false)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isSavingProfile ? 'Saving...' : 'Apply & Sync'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Google Account Selector Dialog */}
      <AnimatePresence>
        {isGoogleModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Choose a Google Account</h3>
                </div>
                <button
                  onClick={() => setIsGoogleModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-500">
                Select one of the demo Google / Gmail accounts to continue to GlobeTrotter AI:
              </p>

              <div className="space-y-2">
                {googleDemoAccounts.map((acc, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectGoogleAccount(acc)}
                    className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={acc.avatar} 
                        alt={acc.name} 
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700" 
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-extrabold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">{acc.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{acc.email}</p>
                        <p className="text-[10px] text-slate-400">{acc.phone}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 shrink-0">
                      {acc.badge}
                    </span>
                  </button>
                ))}
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsGoogleModalOpen(false);
                    setActiveTab('gmail');
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                >
                  Use another email address instead
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {isForgotPasswordOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Reset Password</h3>
                </div>
                <button
                  onClick={() => setIsForgotPasswordOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-500">
                Enter your registered Gmail or Email address. We will dispatch an instant password reset link and recovery instructions.
              </p>

              {resetSentMessage ? (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-medium space-y-2">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Dispatched Successfully</span>
                  </div>
                  <p className="text-[11px] opacity-90">{resetSentMessage}</p>
                  <button
                    onClick={() => setIsForgotPasswordOpen(false)}
                    className="mt-2 w-full py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Return to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Registered Email</label>
                    <div className="relative mt-1">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        id="auth-forgot-email-input"
                        required
                        value={resetEmail}
                        onChange={(e) => {
                          setResetEmail(e.target.value);
                          setTouchedResetEmail(true);
                        }}
                        onBlur={() => setTouchedResetEmail(true)}
                        placeholder="rosterguy24@gmail.com"
                        className={`w-full pl-9 pr-8 py-2.5 rounded-xl border text-xs font-medium focus:outline-none transition-all ${getInputClasses(touchedResetEmail, resetEmailValidation.isValid)}`}
                      />
                      {touchedResetEmail && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {resetEmailValidation.isValid ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-rose-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {touchedResetEmail && !resetEmailValidation.isValid && (
                      <p className="mt-1 text-[11px] font-medium text-rose-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{resetEmailValidation.error}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsForgotPasswordOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      id="auth-forgot-submit-btn"
                      disabled={isSendingReset}
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs disabled:opacity-50 cursor-pointer"
                    >
                      {isSendingReset ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
