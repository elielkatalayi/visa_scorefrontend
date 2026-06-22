// src/components/auth/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.config';

const ForgotPassword = () => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: demande, 2: vérification

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', { phone });
      setMessage(response.data.message || 'Un code de réinitialisation a été envoyé');
      setStep(2);
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la demande');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="form-container">
          <div className="auth-header">
            <div className="auth-icon">🔑</div>
            <h1>Mot de passe oublié</h1>
            <p>Entrez votre numéro de téléphone pour réinitialiser votre mot de passe</p>
          </div>

          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          {step === 1 ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Numéro de téléphone</label>
                <input
                  type="text"
                  placeholder="+243812345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <small>Entrez le numéro associé à votre compte</small>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Envoi en cours...' : 'Envoyer le code'}
                </button>
              </div>
            </form>
          ) : (
            <div className="reset-instructions">
              <div className="info-message">
                <p>📱 Un code de réinitialisation a été envoyé à votre numéro.</p>
                <p>Utilisez-le pour réinitialiser votre mot de passe.</p>
              </div>
              <Link to="/reset-password" className="btn btn-primary">
                Réinitialiser mon mot de passe
              </Link>
              <p className="form-links">
                <Link to="/login">Retour à la connexion</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;