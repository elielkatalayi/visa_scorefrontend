// src/pages/CountriesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../api/axios.config';

const CountriesPage = () => {
  const { countries, loading: countriesLoading } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = countries.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries(countries);
    }
  }, [searchTerm, countries]);

  if (countriesLoading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="countries-page">
      <div className="container">
        <h1>Pays disponibles</h1>
        <p>Sélectionnez un pays pour simuler vos chances d'obtention de visa</p>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher un pays..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="countries-grid">
          {filteredCountries.map((country) => (
            <Link to={`/simulation?country=${country.id}`} key={country.id} className="country-card">
              <div className="country-flag">{country.flag}</div>
              <div className="country-name">{country.name}</div>
              <div className="country-code">{country.code}</div>
              <div className="country-description">{country.description}</div>
            </Link>
          ))}
        </div>

        {filteredCountries.length === 0 && (
          <div className="info-message">Aucun pays trouvé</div>
        )}
      </div>
    </div>
  );
};

export default CountriesPage;