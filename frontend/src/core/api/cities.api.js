import api from './client';

export const citiesApi = {
  getCities: (params = {}) => api.get('/cities', { params }),
  getCity: (id) => api.get(`/cities/${id}`),
  createCity: (cityData) => api.post('/cities', cityData),
  updateCity: (id, cityData) => api.put(`/cities/${id}`, cityData),
  deleteCity: (id) => api.delete(`/cities/${id}`)
};
