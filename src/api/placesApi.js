// Google Places API service
import { GOOGLE_PLACES_API_KEY } from '@env';

// Your Google Places API key from environment variables
const API_KEY = GOOGLE_PLACES_API_KEY || '';

// Base URL for Google Places API
// For web environments, we need to use a CORS proxy
const isWeb = typeof document !== 'undefined';

// IMPORTANT: To use the CORS Anywhere proxy, you need to request temporary access at:
// https://cors-anywhere.herokuapp.com/corsdemo
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

// For web, we use the CORS proxy, for mobile we use the direct URL
const BASE_URL = isWeb ? `${CORS_PROXY}https://maps.googleapis.com/maps/api/place` : 'https://maps.googleapis.com/maps/api/place';

// Check if we have access to the CORS proxy
let corsProxyAccessGranted = false;
if (isWeb) {
  console.log('Running in web environment. CORS proxy may be required.');
  console.log('If you encounter CORS errors, please visit https://cors-anywhere.herokuapp.com/corsdemo to request temporary access.');
}

// Check if API key is available
if (!API_KEY) {
  console.error('Google Places API key is missing! Make sure you have set up your .env file correctly.');
  console.error('Copy .env.example to .env and add your API key.');
}

// Function to search for places by query and type
export const searchPlaces = async (query, type, location = '18.6490,73.8773', radius = 5000) => {
  try {
    // Encode the query parameter to handle spaces and special characters
    const encodedQuery = encodeURIComponent(query);
    const encodedType = encodeURIComponent(type);
    
    console.log(`Searching for: ${encodedQuery}, type: ${encodedType}`);
    console.log('Fetching places from:', isWeb ? 'Using CORS proxy' : 'Direct API call');
    
    const apiUrl = `${BASE_URL}/textsearch/json?query=${encodedQuery}&location=${location}&radius=${radius}&type=${encodedType}&key=${API_KEY}`;
    console.log('Fetching from URL:', apiUrl.replace(API_KEY, 'API_KEY_HIDDEN'));
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      if (response.status === 403 && isWeb) {
        throw new Error('CORS error: Access to the Google Places API is blocked. You need to request temporary access to the CORS proxy.');
      }
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`API Response status: ${data.status}`);
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Places API error:', data.status, data.error_message);
      throw new Error(`API Error: ${data.status} - ${data.error_message || 'Unknown error'}`);
    }
    
    console.log(`Found ${data.results?.length || 0} places`);
    return data.results || [];
  } catch (error) {
    console.error('Error fetching places:', error);
    
    // Check if it's a CORS error
    if (error.message && error.message.includes('Failed to fetch') && isWeb) {
      throw new Error('CORS error: Access to the Google Places API is blocked. You need to request temporary access to the CORS proxy.');
    }
    
    throw error;
  }
};

// Function to get place details by place_id
export const getPlaceDetails = async (placeId) => {
  try {
    console.log(`Getting details for place ID: ${placeId}`);
    
    const apiUrl = `${BASE_URL}/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,opening_hours,photos,rating,reviews,website,geometry&key=${API_KEY}`;
    console.log('Fetching details from URL:', apiUrl.replace(API_KEY, 'API_KEY_HIDDEN'));
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(`Details API Response status: ${data.status}`);
    
    if (data.status !== 'OK') {
      console.error('Place Details API error:', data.status, data.error_message);
      throw new Error(`API Error: ${data.status} - ${data.error_message || 'Unknown error'}`);
    }
    
    return data.result;
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
};

// Function to get place photos
export const getPlacePhoto = (photoReference, maxWidth = 400) => {
  if (!photoReference) {
    console.warn('No photo reference provided');
    return 'https://via.placeholder.com/400x200?text=No+Image';
  }
  
  return `${BASE_URL}/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${API_KEY}`;
};