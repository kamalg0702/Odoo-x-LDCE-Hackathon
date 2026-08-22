import api from './client';

export const stopsApi = {
  getStops: (tripId) => api.get(`/trips/${tripId}/stops`),
  createStop: (tripId, stopData) => api.post(`/trips/${tripId}/stops`, stopData),
  updateStop: (tripId, stopId, stopData) => api.put(`/trips/${tripId}/stops/${stopId}`, stopData),
  deleteStop: (tripId, stopId) => api.delete(`/trips/${tripId}/stops/${stopId}`),
  reorderStops: (tripId, order) => api.patch(`/trips/${tripId}/stops/reorder`, { order })
};
