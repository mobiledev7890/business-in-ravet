import { useState, useEffect } from 'react';
import { getPlaceDetails } from '../api/placesApi';

export const useBusinessDetails = (business) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!business?.place_id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const placeDetails = await getPlaceDetails(business.place_id);
        setDetails(placeDetails);
      } catch (error) {
        console.error('Error fetching business details:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [business]);

  const retry = async () => {
    if (!business?.place_id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const placeDetails = await getPlaceDetails(business.place_id);
      setDetails(placeDetails);
    } catch (error) {
      console.error('Error fetching business details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    details,
    loading,
    error,
    retry,
  };
}; 