import { GOOGLE_PLACES_API_KEY } from '@env';

// NOTE:
// The frontend now primarily talks to your own backend instead of Google
// Places directly. However, a small subset of the original helper functions
// is still used for:
// - `getPlaceDetails` in `useBusinessDetails`
// - `getPlacePhoto` in `BusinessCard` and `BusinessDetails`
//
// The rest of the older Places API utilities and custom hooks were unused in
// the app, so they have been removed to keep this module minimal.

const API_KEY = GOOGLE_PLACES_API_KEY || 'YOUR_ACTUAL_API_KEY_HERE';
const BASE_URL = 'https://maps.googleapis.com/maps/api/place';

const buildApiUrl = (endpoint, params) => {
  const queryString = new URLSearchParams({ ...params, key: API_KEY }).toString();
  return `${BASE_URL}/${endpoint}?${queryString}`;
};

const makeRequest = async (endpoint, params) => {
  if (!API_KEY || API_KEY === 'YOUR_ACTUAL_API_KEY_HERE') {
    throw new Error('Google Places API key is missing. Please add your API key to the .env file.');
  }

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

export const getPlaceDetails = async (placeId) => {
  try {
    const params = {
      place_id: placeId,
      fields:
        'name,formatted_address,formatted_phone_number,opening_hours,photos,rating,reviews,website,geometry',
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