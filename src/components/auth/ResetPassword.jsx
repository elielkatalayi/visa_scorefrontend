// src/components/auth/ResetPassword.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios.config';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    token: '',
    phone: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/reset-password', {
        token: formData.token,
        phone: formData.phone,
        newPassword: formData.newPassword
      });
      
      setMessage('Mot de passe réinitialisé avec succès !');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="form-container">
          <div className="auth-header">
            <div className="auth-icon">🔄</div>
            <h1>Réinitialiser le mot de passe</h1>
            <p>Entrez le code reçu par SMS et votre nouveau mot de passe</p>
          </div>

          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Code de réinitialisation</label>
              <input
                type="text"
                name="token"
                placeholder="Entrez le code reçu par SMS"
                value={formData.token}
                onChange={handleChange}
                required
              />
              <small>Le code a été envoyé par SMS</small>
            </div>

            <div className="form-group">
              <label>Numéro de téléphone</label>
              <input
                type="text"
                name="phone"
                placeholder="+243812345678"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Nouveau mot de passe</label>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="••••••••"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
                <small>Minimum 6 caractères</small>
              </div>

              <div className="form-group">
                <label>Confirmer le mot de passe</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
              </button>
            </div>
          </form>

          <div className="form-links">
            <p>
              <Link to="/login">Retour à la connexion</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;