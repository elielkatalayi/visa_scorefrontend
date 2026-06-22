// src/pages/SimulationPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../api/axios.config';

const SimulationPage = () => {
  const { countries, loading: countriesLoading } = useApp();
  const [selectedCountry, setSelectedCountry] = useState('');
  const [criteria, setCriteria] = useState([]);
  const [responses, setResponses] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadCriteria = async (countryId) => {
    setLoading(true);
    try {
      const response = await api.get(`/countries/${countryId}/criteria`);
      setCriteria(response.data.data.criteria || []);
      setResponses({});
      setCurrentStep(0);
    } catch (error) {
      console.error('Error loading criteria:', error);
      setError('Erreur lors du chargement des critères');
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (e) => {
    const countryId = e.target.value;
    setSelectedCountry(countryId);
    if (countryId) {
      loadCriteria(countryId);
    } else {
      setCriteria([]);
    }
  };

  const handleResponseChange = (criteriaId, value) => {
    setResponses({ ...responses, [criteriaId]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/simulations', {
        country_id: selectedCountry,
        responses: responses
      });
      const simulationId = response.data.data.simulation?.simulation_id || 
                           response.data.data.simulation?.id;
      navigate(`/simulation/${simulationId}/result`);
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la simulation');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < criteria.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (countriesLoading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="simulation-page">
      <div className="container">
        <h1>Simulation de visa</h1>

        <div className="form-container">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Choisissez un pays</label>
            <select
              value={selectedCountry}
              onChange={handleCountryChange}
              className="country-select"
            >
              <option value="">Sélectionnez un pays...</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
          </div>

          {criteria.length > 0 && (
            <form onSubmit={handleSubmit}>
              <div className="criteria-progress">
                Étape {currentStep + 1} / {criteria.length}
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${((currentStep + 1) / criteria.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="criteria-step">
                <div className="card">
                  <h3>{criteria[currentStep]?.name}</h3>
                  <p>{criteria[currentStep]?.description}</p>
                  
                  {criteria[currentStep]?.response_type === 'select' && (
                    <select
                      value={responses[criteria[currentStep]?.id] || ''}
                      onChange={(e) => handleResponseChange(criteria[currentStep]?.id, e.target.value)}
                      required={criteria[currentStep]?.is_required}
                    >
                      <option value="">Choisissez...</option>
                      {criteria[currentStep]?.options && 
                        JSON.parse(criteria[currentStep].options).map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))
                      }
                    </select>
                  )}
                  
                  {criteria[currentStep]?.response_type === 'boolean' && (
                    <div className="boolean-group">
                      <label>
                        <input
                          type="radio"
                          name={`criteria_${criteria[currentStep]?.id}`}
                          value="true"
                          onChange={(e) => handleResponseChange(criteria[currentStep]?.id, e.target.value)}
                        />
                        Oui
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`criteria_${criteria[currentStep]?.id}`}
                          value="false"
                          onChange={(e) => handleResponseChange(criteria[currentStep]?.id, e.target.value)}
                        />
                        Non
                      </label>
                    </div>
                  )}
                  
                  {criteria[currentStep]?.response_type === 'number' && (
                    <input
                      type="number"
                      value={responses[criteria[currentStep]?.id] || ''}
                      onChange={(e) => handleResponseChange(criteria[currentStep]?.id, e.target.value)}
                      placeholder="Entrez un nombre..."
                      required={criteria[currentStep]?.is_required}
                    />
                  )}
                  
                  {criteria[currentStep]?.response_type === 'textarea' && (
                    <textarea
                      value={responses[criteria[currentStep]?.id] || ''}
                      onChange={(e) => handleResponseChange(criteria[currentStep]?.id, e.target.value)}
                      placeholder="Décrivez votre situation..."
                      required={criteria[currentStep]?.is_required}
                    />
                  )}
                </div>
              </div>

              <div className="step-actions">
                <button type="button" onClick={prevStep} disabled={currentStep === 0}>
                  Précédent
                </button>
                {currentStep < criteria.length - 1 ? (
                  <button type="button" onClick={nextStep}>
                    Suivant
                  </button>
                ) : (
                  <button type="submit" disabled={loading}>
                    {loading ? 'Traitement...' : 'Voir mes résultats'}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulationPage;