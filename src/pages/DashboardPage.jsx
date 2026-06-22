// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios.config';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsRes, simsRes] = await Promise.all([
          api.get('/simulations/stats/user'),
          api.get('/simulations')
        ]);
        setStats(statsRes.data.data);
        setSimulations(simsRes.data.data.simulations || []);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="dashboard-page">
      <div className="container">
        <h1>Tableau de bord</h1>
        <p>Bienvenue, {user?.display_name || user?.phone} !</p>

        <div className="stats-grid">
          <div className="card stat-card">
            <div className="stat-number">{stats?.total || 0}</div>
            <div className="stat-label">Total simulations</div>
          </div>
          <div className="card stat-card">
            <div className="stat-number">{stats?.average_score || 0}%</div>
            <div className="stat-label">Score moyen</div>
          </div>
          <div className="card stat-card">
            <div className="stat-number">{stats?.best_score || 0}%</div>
            <div className="stat-label">Meilleur score</div>
          </div>
          <div className="card stat-card">
            <div className="stat-number">{stats?.countries_tested || 0}</div>
            <div className="stat-label">Pays testés</div>
          </div>
        </div>

        <div className="actions">
          <Link to="/simulation" className="btn btn-primary">
            Nouvelle simulation
          </Link>
          <Link to="/history" className="btn btn-outline">
            Voir l'historique
          </Link>
        </div>

        {simulations.length > 0 && (
          <div className="recent-simulations">
            <h2>Dernières simulations</h2>
            <div className="simulation-list">
              {simulations.slice(0, 5).map((sim) => (
                <div key={sim.id} className="card simulation-item">
                  <div className="sim-info">
                    <span className="sim-country">{sim.country_name} {sim.country_flag}</span>
                    <span className="sim-score">Score: {sim.total_score}%</span>
                    <span className="sim-status">{sim.status}</span>
                  </div>
                  <Link to={`/simulation/${sim.id}/result`} className="btn btn-small">
                    Voir détails
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;