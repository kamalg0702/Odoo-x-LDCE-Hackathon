import React, { createContext, useContext, useState, useEffect } from 'react';
import { Trip, NotificationItem } from '../types/index.ts';
import { api } from '../services/api.ts';

interface TripContextType {
  trips: Trip[];
  activeTrip: Trip | null;
  setActiveTrip: (trip: Trip | null) => void;
  loadTrips: () => Promise<void>;
  selectTripById: (id: string) => Promise<Trip | null>;
  updateActiveTripLocally: (updates: Partial<Trip>) => void;
  refreshActiveTrip: () => Promise<void>;
  
  // Notifications
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  markNotificationRead: (id: string) => void;
  
  // Modals state
  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;
  isRescueOpen: boolean;
  setIsRescueOpen: (open: boolean) => void;
  isPhotoToTripOpen: boolean;
  setIsPhotoToTripOpen: (open: boolean) => void;
  isAgentModeOpen: boolean;
  setIsAgentModeOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;

  // Selected map pin focus
  focusedItemId: string | null;
  setFocusedItemId: (id: string | null) => void;
  
  // Hackathon Demo Mode Step Tracker
  demoStep: number;
  setDemoStep: (step: number) => void;
  triggerDemoStep: (step: number) => Promise<void>;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  
  // Modals
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isRescueOpen, setIsRescueOpen] = useState(false);
  const [isPhotoToTripOpen, setIsPhotoToTripOpen] = useState(false);
  const [isAgentModeOpen, setIsAgentModeOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null);
  const [demoStep, setDemoStep] = useState<number>(0);

  const loadTrips = async () => {
    try {
      const data = await api.getTrips();
      setTrips(data);
      if (!activeTrip && data.length > 0) {
        setActiveTrip(data[0]);
      }
    } catch (err) {
      console.error('Failed to load trips:', err);
    }
  };

  const loadNotifications = async () => {
    try {
      const notifs = await api.getNotifications();
      setNotifications(notifs);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  useEffect(() => {
    loadTrips();
    loadNotifications();
  }, []);

  const selectTripById = async (id: string): Promise<Trip | null> => {
    try {
      const trip = await api.getTripById(id);
      setActiveTrip(trip);
      return trip;
    } catch (err) {
      console.error('Select trip error:', err);
      return null;
    }
  };

  const updateActiveTripLocally = (updates: Partial<Trip>) => {
    if (!activeTrip) return;
    const updated = { ...activeTrip, ...updates };
    setActiveTrip(updated);
    setTrips(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const refreshActiveTrip = async () => {
    if (!activeTrip) return;
    try {
      const fresh = await api.getTripById(activeTrip.id);
      setActiveTrip(fresh);
      setTrips(prev => prev.map(t => t.id === fresh.id ? fresh : t));
    } catch (err) {
      console.error('Refresh active trip error:', err);
    }
  };

  const markNotificationRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    await api.markNotificationRead(id);
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const triggerDemoStep = async (step: number) => {
    setDemoStep(step);
    if (!activeTrip && trips.length > 0) {
      setActiveTrip(trips[0]);
    }
  };

  return (
    <TripContext.Provider value={{
      trips,
      activeTrip,
      setActiveTrip,
      loadTrips,
      selectTripById,
      updateActiveTripLocally,
      refreshActiveTrip,
      notifications,
      unreadNotifsCount,
      markNotificationRead,
      isCopilotOpen,
      setIsCopilotOpen,
      isRescueOpen,
      setIsRescueOpen,
      isPhotoToTripOpen,
      setIsPhotoToTripOpen,
      isAgentModeOpen,
      setIsAgentModeOpen,
      isNotificationsOpen,
      setIsNotificationsOpen,
      focusedItemId,
      setFocusedItemId,
      demoStep,
      setDemoStep,
      triggerDemoStep
    }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTrip must be used within TripProvider');
  return ctx;
};
