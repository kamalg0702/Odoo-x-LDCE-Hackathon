import { create } from 'zustand';

const savedTheme = localStorage.getItem('gt_theme') || 'atlas';
document.documentElement.setAttribute('data-theme', savedTheme);

export const THEMES = [
  { id: 'atlas', name: 'Atlas Classic', icon: '🗺️', color: '#2563EB' },
  { id: 'midnight', name: 'Midnight Dark', icon: '🌌', color: '#38BDF8' },
  { id: 'emerald', name: 'Emerald Oasis', icon: '🌿', color: '#059669' },
  { id: 'nordic', name: 'Nordic Frost', icon: '❄️', color: '#0284C7' },
  { id: 'sunset', name: 'Sunset Terracotta', icon: '🌇', color: '#EA580C' },
  { id: 'cyberpunk', name: 'Cyberpunk Neon', icon: '⚡', color: '#A855F7' }
];

export const useUIStore = create((set) => ({
  isSidebarOpen: true,
  theme: savedTheme,
  toast: null,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

  setTheme: (newTheme) => {
    localStorage.setItem('gt_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    set({ theme: newTheme });
  },

  showToast: (message, type = 'info', duration = 3500) => {
    set({ toast: { message, type, id: Date.now() } });
    if (duration > 0) {
      setTimeout(() => {
        set({ toast: null });
      }, duration);
    }
  },

  hideToast: () => set({ toast: null })
}));
