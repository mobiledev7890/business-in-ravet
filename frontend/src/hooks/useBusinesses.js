import { useState, useEffect } from 'react';
import { fetchBusinesses as fetchBusinessesFromBackend } from '../api/backendApi';

export const useBusinesses = (category) => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBusinesses = async () => {
      if (!category) return;

      setLoading(true);
      setError(null);

      try {
        console.log(`Fetching businesses from backend for category: ${category.id}`);
        const results = await fetchBusinessesFromBackend(category.id);
        setBusinesses(results || []);
      } catch (err) {
        console.error('Error fetching businesses:', err);
        setError(
          `Failed to load businesses: ${err.message || 'Unknown error'}. Please make sure the backend is running.`,
        );
      } finally {
        setLoading(false);
      }
    };

    loadBusinesses();
  }, [category]);

  const retry = async () => {
    if (!category) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const results = await fetchBusinessesFromBackend(category.id);
      setBusinesses(results || []);
    } catch (err) {
      console.error('Error fetching businesses:', err);
      setError(`Failed to load businesses: ${err.message || 'Unknown error'}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return {
    businesses,
    loading,
    error,
    retry,
  };
}; 