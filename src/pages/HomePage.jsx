// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <section className="hero">
        <div className="container">
          <h1>Bienvenue sur Visa Chance Calculator</h1>
          <p>
            Évaluez vos chances d'obtention de visa pour différents pays
            en fonction de votre profil personnel et professionnel.
          </p>
          <div className="hero-buttons">
            {isAuthenticated() ? (
              <Link to="/simulation" className="btn btn-primary btn-large">
                Commencer une simulation
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-large">
                  Commencer gratuitement
                </Link>
                <Link to="/login" className="btn btn-outline btn-large">
                  Se connecter
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Comment ça fonctionne ?</h2>
          <div className="grid grid-3">
            <div className="card feature-card">
              <div className="feature-icon">📋</div>
              <h3>1. Créez votre profil</h3>
              <p>Remplissez vos informations personnelles et professionnelles</p>
            </div>
            <div className="card feature-card">
              <div className="feature-icon">🌍</div>
              <h3>2. Choisissez un pays</h3>
              <p>Sélectionnez le pays pour lequel vous souhaitez évaluer vos chances</p>
            </div>
            <div className="card feature-card">
              <div className="feature-icon">📊</div>
              <h3>3. Obtenez votre score</h3>
              <p>Recevez un pourcentage de chance et des conseils personnalisés</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;