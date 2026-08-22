import api from './client';

export const activitiesApi = {
  getActivities: (params = {}) => api.get('/activities', { params }),
  getActivity: (id) => api.get(`/activities/${id}`),
  createActivity: (data) => api.post('/activities', data),
  getStopActivities: (stopId) => api.get(`/stops/${stopId}/activities`),
  addStopActivity: (stopId, data) => api.post(`/stops/${stopId}/activities`, data),
  updateStopActivity: (stopId, id, data) => api.put(`/stops/${stopId}/activities/${id}`, data),
  deleteStopActivity: (stopId, id) => api.delete(`/stops/${stopId}/activities/${id}`)
};
