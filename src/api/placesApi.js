import { GOOGLE_PLACES_API_KEY } from '@env';

const API_KEY = GOOGLE_PLACES_API_KEY || 'YOUR_ACTUAL_API_KEY_HERE';
const isWeb = typeof document !== 'undefined';
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
const BASE_URL = 'https://maps.googleapis.com/maps/api/place';

const validateApiKey = () => {
  if (!API_KEY || API_KEY === 'YOUR_ACTUAL_API_KEY_HERE') {
    throw new Error('Google Places API key is missing. Please add your API key to the .env file.');
  }
};

const buildApiUrl = (endpoint, params) => {
  const queryString = new URLSearchParams({ ...params, key: API_KEY }).toString();
  const directUrl = `${BASE_URL}/${endpoint}?${queryString}`;
  
  return isWeb 
    ? `${CORS_PROXY}${encodeURIComponent(directUrl)}`
    : directUrl;
};

const makeRequest = async (endpoint, params) => {
  validateApiKey();
  
  const url = buildApiUrl(endpoint, params);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(`API Error: ${data.status} - ${data.error_message || 'Unknown error'}`);
  }

  return data;
};

export const searchPlaces = async (query, type, location = '18.6490,73.8773', radius = 5000) => {
  try {
    const params = {
      query: encodeURIComponent(query),
      type: encodeURIComponent(type),
      location,
      radius,
    };

    const data = await makeRequest('textsearch/json', params);
    return data.results || [];
  } catch (error) {
    console.error('Error searching places:', error);
    throw error;
  }
};

export const getPlaceDetails = async (placeId) => {
  try {
    const params = {
      place_id: placeId,
      fields: 'name,formatted_address,formatted_phone_number,opening_hours,photos,rating,reviews,website,geometry',
    };

    const data = await makeRequest('details/json', params);
    return data.result;
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
};

export const getPlacePhoto = (photoReference, maxWidth = 400) => {
  if (!photoReference) {
    return 'https://via.placeholder.com/400x200?text=No+Image';
  }
  
  return `${BASE_URL}/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${API_KEY}`;
};

export const validateApiKeyStatus = async () => {
  try {
    const data = await makeRequest('textsearch/json', { query: 'test' });
    return { valid: true };
  } catch (error) {
    return { 
      valid: false, 
      error: error.message 
    };
  }
};

// Custom hook for places API
export const usePlacesApi = () => {
  const searchPlacesWithHook = async (query, type, location, radius) => {
    return await searchPlaces(query, type, location, radius);
  };

  const getPlaceDetailsWithHook = async (placeId) => {
    return await getPlaceDetails(placeId);
  };

  const validateApiKeyWithHook = async () => {
    return await validateApiKeyStatus();
  };

  return {
    searchPlaces: searchPlacesWithHook,
    getPlaceDetails: getPlaceDetailsWithHook,
    validateApiKey: validateApiKeyWithHook,
    getPlacePhoto,
  };
};