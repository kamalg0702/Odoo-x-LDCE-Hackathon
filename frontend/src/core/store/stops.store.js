import { create } from 'zustand';

export const useStopsStore = create((set) => ({
  stops: [],
  isLoading: false,
  error: null,

  setStops: (stops) => set({ stops }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  addStop: (stop) => set((state) => ({
    stops: [...state.stops, stop]
  })),

  updateStop: (updatedStop) => set((state) => ({
    stops: state.stops.map((s) => (s.id === updatedStop.id ? updatedStop : s))
  })),

  removeStop: (stopId) => set((state) => ({
    stops: state.stops.filter((s) => s.id !== stopId)
  }))
}));
