// src/api/criteria.api.js
import api from './axios.config';

export const criteriaApi = {
  getByCountry: (countryId) => api.get(`/criteria/countries/${countryId}/criteria`),
  getById: (id) => api.get(`/criteria/criteria/${id}`),
  // Admin
  create: (data) => api.post('/admin/criteria', data),
  update: (id, data) => api.put(`/admin/criteria/${id}`, data),
  delete: (id) => api.delete(`/admin/criteria/${id}`),
  reorder: (data) => api.patch('/admin/criteria/reorder', data),
  duplicate: (id, data) => api.post(`/admin/criteria/${id}/duplicate`, data),
};