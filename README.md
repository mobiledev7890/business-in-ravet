# Business in Ravet - Directory App

A React Native application built with Expo that serves as a business directory for the Ravet area in Pune. The app allows users to browse businesses by categories such as grocery shops, salons, hardware shops, and restaurants.

## Features

- Browse businesses by categories
- View detailed information about each business
- See business photos, ratings, and reviews
- Get directions to businesses
- Call businesses directly from the app
- Visit business websites

## Setup Instructions

### Prerequisites

- Node.js
- npm or yarn
- Expo CLI
- Google Places API Key

## Environment Variables

This project uses environment variables to securely store API keys and other sensitive information. The following environment variables are used:

| Variable | Description |
|----------|-------------|
| `GOOGLE_PLACES_API_KEY` | Your Google Places API key for accessing the Places API |

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

### Adding Google Places API Key

Before running the app, you need to add your Google Places API key:

1. Go to the Google Cloud Console and create a project
2. Enable the Google Places API
3. Create an API key

#### Current Implementation (Temporary)

Currently, the API key is hardcoded in the `src/api/placesApi.js` file for development purposes. This is a temporary solution until we resolve the environment variable setup with Expo.

#### Future Implementation (Environment Variables)

In the future, we will use environment variables for API key management:

1. Copy the `.env.example` file to `.env`:
```
   cp .env.example .env
   ```
2. Open the `.env` file and replace `your_google_places_api_key_here` with your actual API key:
   ```
   GOOGLE_PLACES_API_KEY=your_actual_api_key_here
   ```

3. Uncomment the environment variable import in `src/api/placesApi.js`:
   ```javascript
   import { GOOGLE_PLACES_API_KEY } from '@env';
   const API_KEY = GOOGLE_PLACES_API_KEY || '';
   ```

> **Important**: Never commit your `.env` file to version control. It's already added to `.gitignore` to prevent accidental commits.

> **Note**: We're currently experiencing issues with the environment variable setup in Expo. We'll update this documentation once the issue is resolved.

### Running the App

```
npx expo start
```

This will start the Expo development server. You can then run the app on:
- iOS simulator (press i)
- Android emulator (press a)
- Web browser (press w)
- Physical device by scanning the QR code with the Expo Go app

## Project Structure

```
src/
├── api/
│   ├── categories.js     # Business categories data
│   └── placesApi.js      # Google Places API service
├── components/
│   ├── BusinessCard.js   # Business list item component
│   ├── BusinessDetails.js # Business details component
│   └── CategoryCard.js   # Category card component
├── navigation/
│   └── AppNavigator.js   # Navigation configuration
└── screens/
    ├── HomeScreen.js     # Categories list screen
    └── BusinessListScreen.js # Business listings screen
```

## GitHub and API Key Security

When pushing to GitHub, ensure that:

1. The `.env` file is not included in your commits (it should be ignored by `.gitignore`)
2. The temporary API key in `src/api/placesApi.js` is replaced with a placeholder before pushing

For production deployments, consider using:
- Environment variables in your hosting platform
- API key restrictions in the Google Cloud Console (HTTP referrers, IP addresses, etc.)
- A backend proxy service to hide your API key from client-side code

## Customization

### Adding New Categories

To add new business categories, edit the `src/api/categories.js` file and add new category objects to the array.

### Modifying the Search Location

By default, the app searches for businesses in the Ravet area of Pune. To change the search location, modify the `location` parameter in the `searchPlaces` function in `src/api/placesApi.js`.