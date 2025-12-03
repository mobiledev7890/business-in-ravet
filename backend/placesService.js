require('dotenv').config();

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const BASE_URL = 'https://maps.googleapis.com/maps/api/place';

const validateApiKey = () => {
  if (!API_KEY) {
    throw new Error(
      'Google Places API key is missing. Please add GOOGLE_PLACES_API_KEY to backend/.env.',
    );
  }
};

const buildApiUrl = (endpoint, params) => {
  const queryString = new URLSearchParams({ ...params, key: API_KEY }).toString();
  return `${BASE_URL}/${endpoint}?${queryString}`;
};

const makeRequest = async (endpoint, params) => {
  validateApiKey();

  const url = buildApiUrl(endpoint, params);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
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

const searchPlaces = async (query, type, location = '18.6490,73.8773', radius = 5000) => {
  const params = {
    query: encodeURIComponent(query),
    type: encodeURIComponent(type),
    location,
    radius,
  };

  const data = await makeRequest('textsearch/json', params);
  return data.results || [];
};

module.exports = {
  searchPlaces,
};


