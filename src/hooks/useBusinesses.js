import { useState, useEffect } from 'react';
import { searchPlaces } from '../api/placesApi';

export const useBusinesses = (category) => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      if (!category) return;

      setLoading(true);
      setError(null);

      try {
        console.log(`Fetching businesses for category: ${category.title}`);
        const results = await searchPlaces(category.searchTerm, category.placeType);
        
        if (!results || results.length === 0) {
          console.log('No results found for this category');
        } else {
          console.log(`Found ${results.length} businesses`);
        }
        
        setBusinesses(results || []);
      } catch (err) {
        console.error('Error fetching businesses:', err);
        setError(`Failed to load businesses: ${err.message || 'Unknown error'}. Please check your API key and try again.`);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [category]);

  const retry = async () => {
    if (!category) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const results = await searchPlaces(category.searchTerm, category.placeType);
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