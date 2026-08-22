import { create } from 'zustand';

const initialUser = (() => {
  try {
    const stored = localStorage.getItem('gt_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
})();

export const useAuthStore = create((set) => ({
  user: initialUser,
  accessToken: localStorage.getItem('gt_access_token') || null,
  isAuthenticated: !!localStorage.getItem('gt_access_token'),
  isLoading: false,
  error: null,

  setUser: (user) => {
    localStorage.setItem('gt_user', JSON.stringify(user));
    set({ user, isAuthenticated: !!user });
  },

  setAuthData: (user, accessToken, refreshToken) => {
    localStorage.setItem('gt_user', JSON.stringify(user));
    localStorage.setItem('gt_access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('gt_refresh_token', refreshToken);
    }
    set({ user, accessToken, isAuthenticated: true, error: null });
  },

  logout: () => {
    localStorage.removeItem('gt_user');
    localStorage.removeItem('gt_access_token');
    localStorage.removeItem('gt_refresh_token');
    set({ user: null, accessToken: null, isAuthenticated: false, error: null });
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error })
}));
