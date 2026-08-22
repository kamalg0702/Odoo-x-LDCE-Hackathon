import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isSidebarOpen: true,
  toast: null,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

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
