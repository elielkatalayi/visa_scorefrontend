// src/api/country.api.js
import api from './axios.config';

export const countryApi = {
  getAll: (params) => api.get('/countries', { params }),
  getById: (id) => api.get(`/countries/${id}`),
  getByCode: (code) => api.get(`/countries/code/${code}`),
  search: (query) => api.get('/countries/search', { params: { q: query } }),
  // Admin
  create: (data) => api.post('/admin/countries', data),
  update: (id, data) => api.put(`/admin/countries/${id}`, data),
  delete: (id) => api.delete(`/admin/countries/${id}`),
};