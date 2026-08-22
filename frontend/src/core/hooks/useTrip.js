import { useCallback } from 'react';
import { useTripsStore } from '../store/trips.store';
import { useUIStore } from '../store/ui.store';
import { tripsApi } from '../api/trips.api';

export function useTrip() {
  const {
    trips,
    currentTrip,
    isLoading,
    error,
    setTrips,
    setCurrentTrip,
    addTrip,
    updateTripInList,
    removeTripFromList,
    setLoading,
    setError
  } = useTripsStore();

  const { showToast } = useUIStore();

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await tripsApi.getTrips();
      setTrips(res.data.trips);
      return res.data.trips;
    } catch (err) {
      const message = err.error || 'Failed to fetch trips';
      setError(message);
      showToast(message, 'error');
      return [];
    } finally {
      setLoading(false);
    }
  }, [setTrips, setLoading, setError, showToast]);

  const fetchTripById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await tripsApi.getTrip(id);
      setCurrentTrip(res.data.trip);
      return res.data.trip;
    } catch (err) {
      const message = err.error || 'Trip not found';
      setError(message);
      showToast(message, 'error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [setCurrentTrip, setLoading, setError, showToast]);

  const createNewTrip = useCallback(async (tripData) => {
    setLoading(true);
    try {
      const res = await tripsApi.createTrip(tripData);
      const created = res.data.trip;
      addTrip(created);
      showToast(`Trip "${created.name}" created!`, 'success');
      return created;
    } catch (err) {
      const message = err.error || 'Failed to create trip';
      showToast(message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [addTrip, setLoading, showToast]);

  const updateTrip = useCallback(async (id, tripData) => {
    setLoading(true);
    try {
      const res = await tripsApi.updateTrip(id, tripData);
      const updated = res.data.trip;
      updateTripInList(updated);
      showToast('Trip updated successfully.', 'success');
      return updated;
    } catch (err) {
      const message = err.error || 'Failed to update trip';
      showToast(message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateTripInList, setLoading, showToast]);

  const deleteTrip = useCallback(async (id) => {
    setLoading(true);
    try {
      await tripsApi.deleteTrip(id);
      removeTripFromList(id);
      showToast('Trip deleted.', 'info');
      return true;
    } catch (err) {
      const message = err.error || 'Failed to delete trip';
      showToast(message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [removeTripFromList, setLoading, showToast]);

  return {
    trips,
    currentTrip,
    isLoading,
    error,
    fetchTrips,
    fetchTripById,
    createNewTrip,
    updateTrip,
    deleteTrip,
    setCurrentTrip
  };
}
