import { create } from 'zustand';

export const useCitiesStore = create((set) => ({
  cities: [],
  selectedCity: null,
  filters: {
    query: '',
    region: 'All',
    maxCost: null
  },
  isLoading: false,
  error: null,

  setCities: (cities) => set({ cities }),
  setSelectedCity: (selectedCity) => set({ selectedCity }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error })
}));
