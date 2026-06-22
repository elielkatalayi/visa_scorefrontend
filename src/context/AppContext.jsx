// src/context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { countryApi } from '../api/country.api';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const loadCountries = async () => {
    setLoading(true);
    try {
      const response = await countryApi.getAll();
      setCountries(response.data.data.countries || []);
    } catch (error) {
      console.error('Error loading countries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCountries();
  }, []);

  return (
    <AppContext.Provider value={{
      countries,
      loading,
      selectedCountry,
      setSelectedCountry,
      loadCountries,
    }}>
      {children}
    </AppContext.Provider>
  );
};