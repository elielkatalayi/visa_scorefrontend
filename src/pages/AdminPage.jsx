// src/pages/AdminPage.jsx
import React, { useEffect, useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import api from '../api/axios.config';

const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data.data);
      } catch (error) {
        console.error('Error loading admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="admin-page">
      <div className="container">
        <h1>Administration</h1>
        
        <div className="admin-nav">
          <Link to="/admin" className="admin-nav-link">Dashboard</Link>
          <Link to="/admin/countries" className="admin-nav-link">Pays</Link>
          <Link to="/admin/criteria" className="admin-nav-link">Critères</Link>
          <Link to="/admin/users" className="admin-nav-link">Utilisateurs</Link>
          <Link to="/admin/simulations" className="admin-nav-link">Simulations</Link>
        </div>

        <div className="admin-stats">
          <div className="card stat-card">
            <div className="stat-number">{stats?.users?.total || 0}</div>
            <div className="stat-label">Utilisateurs</div>
          </div>
          <div className="card stat-card">
            <div className="stat-number">{stats?.simulations?.total_simulations || 0}</div>
            <div className="stat-label">Simulations</div>
          </div>
          <div className="card stat-card">
            <div className="stat-number">{stats?.countries?.active || 0}</div>
            <div className="stat-label">Pays actifs</div>
          </div>
          <div className="card stat-card">
            <div className="stat-number">{stats?.simulations?.average_score || 0}%</div>
            <div className="stat-label">Score moyen</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;