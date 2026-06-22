// src/pages/SimulationPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../api/axios.config';

const SimulationPage = () => {
  const { countries, loading: countriesLoading } = useApp();
  const [searchParams] = useSearchParams();
  const [selectedCountry, setSelectedCountry] = useState(searchParams.get('country') || '');
  const [criteria, setCriteria] = useState([]);
  const [responses, setResponses] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countryName, setCountryName] = useState('');
  const navigate = useNavigate();

  // Charger les critères quand un pays est sélectionné
  useEffect(() => {
    if (selectedCountry) {
      loadCriteria(selectedCountry);
      // Trouver le nom du pays
      const country = countries.find(c => c.id === selectedCountry);
      if (country) {
        setCountryName(country.name);
      }
    } else {
      setCriteria([]);
      setCountryName('');
    }
  }, [selectedCountry, countries]);

  // Charger les critères du pays
  const loadCriteria = async (countryId) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/criteria/countries/${countryId}/criteria`);
      const criteriaList = response.data.data.criteria || [];
      setCriteria(criteriaList);
      setResponses({});
      setCurrentStep(0);
      
      if (criteriaList.length === 0) {
        setError('Aucun critère trouvé pour ce pays. Contactez l\'administrateur.');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors du chargement des critères');
      console.error('Error loading criteria:', error);
    } finally {
      setLoading(false);
    }
  };

  // Changer de pays
  const handleCountryChange = (e) => {
    const countryId = e.target.value;
    setSelectedCountry(countryId);
  };

  // Répondre à un critère
  const handleResponseChange = (criteriaId, value) => {
    setResponses({ ...responses, [criteriaId]: value });
  };

  // Étape suivante
  const nextStep = () => {
    // Vérifier si la réponse actuelle est valide
    const currentCriterion = criteria[currentStep];
    if (currentCriterion?.is_required && !responses[currentCriterion.id]) {
      setError('Veuillez répondre à cette question avant de continuer.');
      return;
    }
    setError('');
    if (currentStep < criteria.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Étape précédente
  const prevStep = () => {
    setError('');
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Vérifier que toutes les réponses obligatoires sont remplies
    const missingRequired = criteria
      .filter(c => c.is_required && !responses[c.id])
      .map(c => c.name);

    if (missingRequired.length > 0) {
      setError(`Veuillez répondre à toutes les questions obligatoires: ${missingRequired.join(', ')}`);
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/simulations', {
        country_id: selectedCountry,
        responses: responses
      });

      const simulationId = response.data.data.simulation?.simulation_id || 
                           response.data.data.simulation?.id;
      
      if (simulationId) {
        navigate(`/simulation/${simulationId}/result`);
      } else {
        setError('Erreur: ID de simulation non trouvé');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la simulation');
      console.error('Error creating simulation:', error);
    } finally {
      setLoading(false);
    }
  };

  // Rendu d'un champ en fonction du type
  const renderField = (criterion) => {
    const value = responses[criterion.id] || '';

    switch (criterion.response_type) {
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleResponseChange(criterion.id, e.target.value)}
            required={criterion.is_required}
            className="form-control"
          >
            <option value="">Choisissez...</option>
            {criterion.options && JSON.parse(criterion.options).map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );

      case 'boolean':
        return (
          <div className="boolean-group">
            <label className="boolean-option">
              <input
                type="radio"
                name={`criteria_${criterion.id}`}
                value="true"
                checked={value === 'true'}
                onChange={(e) => handleResponseChange(criterion.id, e.target.value)}
              />
              <span>Oui</span>
            </label>
            <label className="boolean-option">
              <input
                type="radio"
                name={`criteria_${criterion.id}`}
                value="false"
                checked={value === 'false'}
                onChange={(e) => handleResponseChange(criterion.id, e.target.value)}
              />
              <span>Non</span>
            </label>
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleResponseChange(criterion.id, e.target.value)}
            placeholder="Entrez un nombre..."
            required={criterion.is_required}
            className="form-control"
            min={criterion.min_value || 0}
            max={criterion.max_value || undefined}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleResponseChange(criterion.id, e.target.value)}
            required={criterion.is_required}
            className="form-control"
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleResponseChange(criterion.id, e.target.value)}
            placeholder="Décrivez votre situation..."
            required={criterion.is_required}
            className="form-control"
            rows={4}
          />
        );

      case 'text':
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleResponseChange(criterion.id, e.target.value)}
            placeholder="Entrez votre réponse..."
            required={criterion.is_required}
            className="form-control"
          />
        );
    }
  };

  // Affichage du chargement
  if (countriesLoading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement des pays...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="simulation-page">
      <div className="container">
        <div className="page-header">
          <h1>Simulation de visa</h1>
          <p>Répondez aux questions pour évaluer vos chances d'obtention de visa</p>
        </div>

        <div className="simulation-container">
          {/* Sélection du pays */}
          <div className="country-selection card">
            <label htmlFor="country-select" className="form-label">
              <strong>🌍 Choisissez un pays</strong>
            </label>
            <select
              id="country-select"
              value={selectedCountry}
              onChange={handleCountryChange}
              className="country-select"
              disabled={loading}
            >
              <option value="">Sélectionnez un pays...</option>
              {countries.filter(c => c.is_active !== false).map((country) => (
                <option key={country.id} value={country.id}>
                  {country.flag || '🌍'} {country.name} ({country.code})
                </option>
              ))}
            </select>
            {selectedCountry && countryName && (
              <div className="selected-country">
                <span className="badge">Pays sélectionné: {countryName}</span>
              </div>
            )}
          </div>

          {/* Zone de chargement ou d'erreur */}
          {loading && !criteria.length && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Chargement des critères...</p>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          {/* Formulaire des critères */}
          {criteria.length > 0 && selectedCountry && (
            <form onSubmit={handleSubmit} className="criteria-form">
              {/* Progression */}
              <div className="criteria-progress card">
                <div className="progress-header">
                  <span>Question {currentStep + 1} / {criteria.length}</span>
                  <span className="progress-percentage">
                    {Math.round(((currentStep + 1) / criteria.length) * 100)}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${((currentStep + 1) / criteria.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question actuelle */}
              <div className="criteria-step card">
                {criteria[currentStep] && (
                  <>
                    <div className="step-header">
                      <span className="step-number">Étape {currentStep + 1}</span>
                      {criteria[currentStep].is_required && (
                        <span className="required-badge">* Obligatoire</span>
                      )}
                    </div>
                    <h3 className="criteria-name">{criteria[currentStep].name}</h3>
                    {criteria[currentStep].description && (
                      <p className="criteria-description">
                        {criteria[currentStep].description}
                      </p>
                    )}
                    <div className="criteria-field">
                      {renderField(criteria[currentStep])}
                    </div>
                    {criteria[currentStep].weight && (
                      <div className="criteria-weight">
                        Poids: {criteria[currentStep].weight}/10
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Boutons de navigation */}
              <div className="step-actions">
                <button 
                  type="button" 
                  onClick={prevStep} 
                  disabled={currentStep === 0}
                  className="btn btn-secondary"
                >
                  ← Précédent
                </button>
                {currentStep < criteria.length - 1 ? (
                  <button 
                    type="button" 
                    onClick={nextStep}
                    className="btn btn-primary"
                  >
                    Suivant →
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn btn-success"
                  >
                    {loading ? 'Traitement en cours...' : '📊 Voir mes résultats'}
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Message si aucun critère */}
          {selectedCountry && criteria.length === 0 && !loading && !error && (
            <div className="info-message">
              <p>⚠️ Aucun critère n'a été configuré pour ce pays.</p>
              <p>Veuillez contacter l'administrateur du site.</p>
            </div>
          )}

          {/* Message si aucun pays sélectionné */}
          {!selectedCountry && !loading && (
            <div className="info-message">
              <p>👆 Sélectionnez un pays ci-dessus pour commencer votre simulation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulationPage;