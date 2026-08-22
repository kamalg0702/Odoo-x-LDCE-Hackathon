import api from './client';

export const shareApi = {
  shareTrip: (tripId) => api.post(`/trips/${tripId}/share`),
  getPublicTrip: (slug) => api.get(`/share/${slug}`)
};
