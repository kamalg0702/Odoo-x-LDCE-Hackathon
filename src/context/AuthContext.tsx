import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.ts';
import { api } from '../services/api.ts';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: string | { email?: string; phoneNumber?: string; name?: string }) => Promise<boolean>;
  signup: (name: string, email?: string, homeCity?: string, phoneNumber?: string) => Promise<boolean>;
  sendOtp: (phoneNumber: string) => Promise<{ success: boolean; message: string; demoOtp: string }>;
  logout: () => void;
  switchUser: (user: User) => void;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
  availableUsers: User[];
  demoUsers: User[];
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  signup: async () => false,
  sendOtp: async () => ({ success: true, message: '', demoOtp: '7729' }),
  logout: () => {},
  switchUser: () => {},
  updateProfile: async () => false,
  deleteAccount: async () => false,
  availableUsers: [],
  demoUsers: []
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const cached = localStorage.getItem('gt_user_profile');
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.warn('Failed to parse cached user profile:', e);
    }
    return null;
  });
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      try {
        const users = await api.getUsers();
        setAvailableUsers(users);
        const cachedStr = localStorage.getItem('gt_user_profile');
        let currentProfile: User | null = null;
        if (cachedStr) {
          try {
            currentProfile = JSON.parse(cachedStr);
          } catch (e) {}
        }
        const savedEmail = localStorage.getItem('gt_user_email') || (currentProfile?.email) || 'rosterguy24@gmail.com';
        const found = users.find(u => u.email.toLowerCase() === savedEmail.toLowerCase()) 
          || (currentProfile ? currentProfile : users[0]);
        
        setUser(found || null);
        if (found) {
          localStorage.setItem('gt_user_email', found.email);
          localStorage.setItem('gt_user_profile', JSON.stringify(found));
        }
      } catch (err) {
        console.error('Failed to load users:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = async (credentials: string | { email?: string; phoneNumber?: string; name?: string }): Promise<boolean> => {
    try {
      const res = await api.login(credentials);
      if (res.success && res.user) {
        setUser(res.user);
        setAvailableUsers(prev => {
          const exists = prev.some(u => u.id === res.user.id);
          return exists ? prev.map(u => u.id === res.user.id ? res.user : u) : [...prev, res.user];
        });
        localStorage.setItem('gt_user_email', res.user.email);
        localStorage.setItem('gt_user_profile', JSON.stringify(res.user));
        return true;
      }
    } catch (err) {
      console.error('Login error:', err);
    }
    return false;
  };

  const signup = async (name: string, email?: string, homeCity?: string, phoneNumber?: string): Promise<boolean> => {
    try {
      const res = await api.signup({ name, email, homeCity, phoneNumber });
      if (res.success && res.user) {
        setUser(res.user);
        setAvailableUsers(prev => [...prev.filter(u => u.id !== res.user.id), res.user]);
        localStorage.setItem('gt_user_email', res.user.email);
        localStorage.setItem('gt_user_profile', JSON.stringify(res.user));
        return true;
      }
    } catch (err) {
      console.error('Signup error:', err);
    }
    return false;
  };

  const sendOtp = async (phoneNumber: string): Promise<{ success: boolean; message: string; demoOtp: string }> => {
    try {
      return await api.sendOtp(phoneNumber);
    } catch (err) {
      console.error('Send OTP error:', err);
      return { success: true, message: 'Demo OTP generated', demoOtp: '7729' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gt_user_email');
    localStorage.removeItem('gt_user_profile');
  };

  const switchUser = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('gt_user_email', newUser.email);
    localStorage.setItem('gt_user_profile', JSON.stringify(newUser));
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    try {
      const res = await api.updateProfile(user.id, updates);
      if (res.success && res.user) {
        setUser(res.user);
        setAvailableUsers(prev => prev.map(u => u.id === res.user.id ? res.user : u));
        if (res.user.email) {
          localStorage.setItem('gt_user_email', res.user.email);
        }
        localStorage.setItem('gt_user_profile', JSON.stringify(res.user));
        return true;
      } else {
        // Optimistic local update fallback
        const updatedLocal = { ...user, ...updates };
        setUser(updatedLocal);
        setAvailableUsers(prev => prev.map(u => u.id === user.id ? updatedLocal : u));
        localStorage.setItem('gt_user_profile', JSON.stringify(updatedLocal));
        return true;
      }
    } catch (err) {
      console.error('Update profile error:', err);
      const updatedLocal = { ...user, ...updates };
      setUser(updatedLocal);
      localStorage.setItem('gt_user_profile', JSON.stringify(updatedLocal));
      return true;
    }
  };

  const deleteAccount = async (): Promise<boolean> => {
    if (!user) return false;
    try {
      const res = await api.deleteAccount(user.id);
      if (res.success) {
        logout();
        return true;
      }
    } catch (err) {
      console.error('Delete account error:', err);
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ 
      user, isLoading, login, signup, sendOtp, logout, switchUser, 
      updateProfile, deleteAccount, availableUsers, demoUsers: availableUsers 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
