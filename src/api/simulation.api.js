// src/api/simulation.api.js
import api from './axios.config';

export const simulationApi = {
  getAll: (params) => api.get('/simulations', { params }),
  getById: (id) => api.get(`/simulations/${id}`),
  create: (data) => api.post('/simulations', data),
  update: (id, data) => api.put(`/simulations/${id}`, data),
  delete: (id) => api.delete(`/simulations/${id}`),
  exportPDF: (id) => api.get(`/simulations/${id}/export-pdf`, { responseType: 'blob' }),
  getAdvice: (id) => api.get(`/simulations/${id}/advice`),
  getStats: () => api.get('/simulations/stats/user'),
};