import { useCallback } from 'react';
import { useStopsStore } from '../store/stops.store';
import { useUIStore } from '../store/ui.store';
import { stopsApi } from '../api/stops.api';

export function useStops(tripId) {
  const {
    stops,
    isLoading,
    error,
    setStops,
    addStop,
    updateStop,
    removeStop,
    setLoading,
    setError
  } = useStopsStore();

  const { showToast } = useUIStore();

  const fetchStops = useCallback(async () => {
    if (!tripId) return [];
    setLoading(true);
    setError(null);
    try {
      const res = await stopsApi.getStops(tripId);
      setStops(res.data.stops);
      return res.data.stops;
    } catch (err) {
      const message = err.error || 'Failed to fetch itinerary stops';
      setError(message);
      showToast(message, 'error');
      return [];
    } finally {
      setLoading(false);
    }
  }, [tripId, setStops, setLoading, setError, showToast]);

  const addStopToTrip = useCallback(async (stopData) => {
    setLoading(true);
    try {
      const res = await stopsApi.createStop(tripId, stopData);
      const created = res.data.stop;
      addStop(created);
      showToast(`Added ${created.city?.name || 'city'} to itinerary!`, 'success');
      return created;
    } catch (err) {
      const message = err.error || 'Failed to add stop';
      showToast(message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [tripId, addStop, setLoading, showToast]);

  const updateStopDetails = useCallback(async (stopId, stopData) => {
    setLoading(true);
    try {
      const res = await stopsApi.updateStop(tripId, stopId, stopData);
      const updated = res.data.stop;
      updateStop(updated);
      showToast('Stop updated.', 'success');
      return updated;
    } catch (err) {
      const message = err.error || 'Failed to update stop';
      showToast(message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [tripId, updateStop, setLoading, showToast]);

  const deleteStopFromTrip = useCallback(async (stopId) => {
    setLoading(true);
    try {
      await stopsApi.deleteStop(tripId, stopId);
      removeStop(stopId);
      showToast('Stop removed from itinerary.', 'info');
      return true;
    } catch (err) {
      const message = err.error || 'Failed to remove stop';
      showToast(message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [tripId, removeStop, setLoading, showToast]);

  const reorderTripStops = useCallback(async (orderedIds) => {
    // Optimistic UI update
    const stopMap = new Map(stops.map(s => [s.id, s]));
    const reordered = orderedIds.map((id, index) => ({
      ...stopMap.get(id),
      order_index: index
    })).filter(Boolean);
    setStops(reordered);

    try {
      const res = await stopsApi.reorderStops(tripId, orderedIds);
      if (res.data.stops) {
        setStops(res.data.stops);
      }
      return true;
    } catch (err) {
      // Revert if error
      fetchStops();
      const message = err.error || 'Failed to save new order';
      showToast(message, 'error');
      return false;
    }
  }, [tripId, stops, setStops, fetchStops, showToast]);

  return {
    stops,
    isLoading,
    error,
    fetchStops,
    addStopToTrip,
    updateStopDetails,
    deleteStopFromTrip,
    reorderTripStops,
    setStops
  };
}
