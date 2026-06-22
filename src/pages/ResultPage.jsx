// src/pages/ResultPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios.config';

const ResultPage = () => {
  const { id } = useParams();
  const [simulation, setSimulation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadResult = async () => {
      try {
        const response = await api.get(`/simulations/${id}`);
        setSimulation(response.data.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Erreur lors du chargement des résultats');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      loadResult();
    }
  }, [id]);

  const getScoreColor = (score) => {
    if (score >= 70) return 'score-high';
    if (score >= 40) return 'score-medium';
    return 'score-low';
  };

  const getScoreLabel = (score) => {
    if (score >= 70) return '⭐ Excellent - Très bonnes chances !';
    if (score >= 50) return '✅ Bon - Bonnes chances';
    if (score >= 30) return '📊 Moyen - Chances à améliorer';
    return '⚠️ Faible - Risque élevé';
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  if (error) {
    return (
      <div className="container">
        <div className="error-message">{error}</div>
        <Link to="/simulation" className="btn btn-primary">Retour à la simulation</Link>
      </div>
    );
  }

  if (!simulation) {
    return (
      <div className="container">
        <div className="info-message">Simulation non trouvée</div>
        <Link to="/simulation" className="btn btn-primary">Retour à la simulation</Link>
      </div>
    );
  }

  const score = simulation.total_score || 0;

  return (
    <div className="result-page">
      <div className="container">
        <h1>Résultat de la simulation</h1>
        
        <div className="card result-card">
          <div className="result-header">
            <div className="result-country">
              {simulation.country_flag} {simulation.country_name}
            </div>
            <div className="result-date">
              {new Date(simulation.created_at).toLocaleDateString()}
            </div>
          </div>

          <div className="result-score">
            <div className={`score-circle ${getScoreColor(score)}`}>
              {score}%
            </div>
            <div className="score-label">{getScoreLabel(score)}</div>
          </div>

          <div className="result-breakdown">
            <h3>Détails du score</h3>
            <div className="breakdown-grid">
              <div className="breakdown-item">
                <span className="breakdown-label">Excellent</span>
                <span className="breakdown-value">{simulation.breakdown?.excellent || 0}</span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Bon</span>
                <span className="breakdown-value">{simulation.breakdown?.good || 0}</span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Moyen</span>
                <span className="breakdown-value">{simulation.breakdown?.average || 0}</span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Faible</span>
                <span className="breakdown-value">{simulation.breakdown?.poor || 0}</span>
              </div>
            </div>
          </div>

          {simulation.advice && simulation.advice.length > 0 && (
            <div className="result-advice">
              <h3>💡 Conseils personnalisés</h3>
              {simulation.advice.map((advice, index) => (
                <div key={index} className="advice-item">
                  <div className="advice-priority">Priorité: {advice.priority}</div>
                  <p>{advice.message}</p>
                </div>
              ))}
            </div>
          )}

          <div className="result-actions">
            <button 
              onClick={() => window.print()} 
              className="btn btn-outline"
            >
              🖨️ Imprimer
            </button>
            <Link to="/simulation" className="btn btn-primary">
              Nouvelle simulation
            </Link>
            <Link to="/dashboard" className="btn btn-outline">
              Retour au dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;