import { create } from 'zustand';

export const useTripsStore = create((set, get) => ({
  trips: [],
  currentTrip: null,
  isLoading: false,
  error: null,

  setTrips: (trips) => set({ trips }),
  setCurrentTrip: (currentTrip) => set({ currentTrip }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  addTrip: (newTrip) => set((state) => ({
    trips: [newTrip, ...state.trips],
    currentTrip: newTrip
  })),

  updateTripInList: (updatedTrip) => set((state) => ({
    trips: state.trips.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)),
    currentTrip: state.currentTrip?.id === updatedTrip.id ? updatedTrip : state.currentTrip
  })),

  removeTripFromList: (tripId) => set((state) => ({
    trips: state.trips.filter((t) => t.id !== tripId),
    currentTrip: state.currentTrip?.id === tripId ? null : state.currentTrip
  }))
}));
