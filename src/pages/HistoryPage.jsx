// src/pages/HistoryPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.config';

const HistoryPage = () => {
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await api.get('/simulations');
        setSimulations(response.data.data.simulations || []);
      } catch (error) {
        setError(error.response?.data?.message || 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="history-page">
      <div className="container">
        <h1>Historique des simulations</h1>
        
        {error && <div className="error-message">{error}</div>}

        {simulations.length === 0 ? (
          <div className="card">
            <p>Vous n'avez pas encore de simulations.</p>
            <Link to="/simulation" className="btn btn-primary">
              Commencer une simulation
            </Link>
          </div>
        ) : (
          <div className="simulation-list">
            {simulations.map((sim) => (
              <div key={sim.id} className="card simulation-item">
                <div className="sim-info">
                  <div className="sim-country">
                    {sim.country_flag} {sim.country_name}
                  </div>
                  <div className="sim-score">
                    Score: <strong>{sim.total_score}%</strong>
                  </div>
                  <div className="sim-status">
                    Statut: <span className={`status-${sim.status}`}>{sim.status}</span>
                  </div>
                  <div className="sim-date">
                    {new Date(sim.created_at).toLocaleDateString()}
                  </div>
                </div>
                <Link to={`/simulation/${sim.id}/result`} className="btn btn-small">
                  Voir détails
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;