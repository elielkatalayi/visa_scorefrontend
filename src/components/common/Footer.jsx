// src/components/common/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>
          &copy; {new Date().getFullYear()} Visa Chance Calculator - Tous droits réservés
        </p>
        <p>
          <a href="/mentions-legales">Mentions légales</a> | 
          <a href="/politique-confidentialite"> Politique de confidentialité</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;