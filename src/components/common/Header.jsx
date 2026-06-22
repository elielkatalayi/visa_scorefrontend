// src/components/common/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-left">
          <Link to="/" className="logo">
            <span className="logo-icon">🛂</span>
            <span className="logo-text">Visa Chance</span>
          </Link>
        </div>
        
        <nav className="header-nav">
          <Link to="/">Accueil</Link>
          <Link to="/countries">Pays</Link>
          
          {isAuthenticated() && (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/simulation">Simulation</Link>
              <Link to="/history">Historique</Link>
              <Link to="/profile">Profil</Link>
              
              {isAdmin() && (
                <Link to="/admin" className="admin-link">Admin</Link>
              )}
            </>
          )}
        </nav>
        
        <div className="header-right">
          {isAuthenticated() ? (
            <div className="user-menu">
              <span className="user-name">
                {user?.display_name || user?.phone}
              </span>
              <button onClick={handleLogout} className="logout-btn">
                Déconnexion
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline">Connexion</Link>
              <Link to="/register" className="btn btn-primary">Inscription</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;