// src/api/admin.api.js
import api from './axios.config';

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getSimulations: (params) => api.get('/admin/simulations', { params }),
  getHealth: () => api.get('/admin/health'),
  cleanExports: (data) => api.post('/admin/clean-exports', data),
  cleanSessions: () => api.post('/admin/clean-sessions'),
  exportUsers: () => api.get('/admin/export/users', { responseType: 'blob' }),
  exportSimulations: () => api.get('/admin/export/simulations', { responseType: 'blob' }),
};