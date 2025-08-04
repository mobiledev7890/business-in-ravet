# Business in Ravet

A React Native mobile application for discovering local businesses in Ravet, Pune. Built with Expo and Google Places API.

## 🚀 Features

- **Business Categories**: Browse businesses by category (Grocery, Salons, Hardware, Restaurants)
- **Business Details**: View detailed information including photos, reviews, and contact details
- **Interactive Maps**: Get directions to businesses using Google Maps
- **Contact Integration**: Call businesses directly from the app
- **Cross-Platform**: Works on iOS, Android, and Web

## 🛠️ Tech Stack

- **React Native** with Expo
- **Google Places API** for business data
- **React Navigation** for app navigation
- **FontAwesome** for icons
- **Custom Hooks** for state management

## 📱 Screenshots

*Add screenshots here when available*

## 🏗️ Architecture

The app follows **SOLID principles** and modern React patterns:

### Custom Hooks
- `useBusinesses` - Manages business data fetching
- `useSelectedBusiness` - Manages selected business state
- `useCategories` - Manages categories data
- `useBusinessDetails` - Manages business details fetching

### Components
- `BusinessCard` - Displays business information in list
- `BusinessDetails` - Shows detailed business information
- `CategoryCard` - Displays business categories

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Google Places API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/business-in-ravet.git
   cd business-in-ravet
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Google Places API key:
   ```
   GOOGLE_PLACES_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

### Getting a Google Places API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Places API** service
4. Create an API key in the Credentials section
5. Add the API key to your `.env` file

## 📁 Project Structure

```
src/
├── api/
│   ├── categories.js     # Business categories data
│   └── placesApi.js      # Google Places API service
├── components/
│   ├── BusinessCard.js   # Business list item component
│   ├── BusinessDetails.js # Business details component
│   └── CategoryCard.js   # Category card component
├── hooks/
│   ├── useBusinesses.js      # Business data management
│   ├── useSelectedBusiness.js # Selected business state
│   ├── useCategories.js      # Categories data
│   └── useBusinessDetails.js # Business details fetching
├── navigation/
│   └── AppNavigator.js   # Navigation configuration
└── screens/
    ├── HomeScreen.js     # Categories list screen
    └── BusinessListScreen.js # Business listings screen
```

## 🔧 Development

### Running the App

- **Web**: Press `w` in the terminal or visit `http://localhost:19006`
- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal
- **Physical Device**: Scan the QR code with Expo Go app

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web

## 🎯 Features in Detail

### Business Search
- Search businesses by category in Ravet, Pune
- Real-time data from Google Places API
- Location-based search with customizable radius

### Business Details
- Complete business information
- Photos and reviews
- Opening hours
- Contact information
- Direct integration with phone and maps

### User Experience
- Clean, modern UI design
- Smooth navigation
- Loading states and error handling
- Retry functionality for failed requests

## 🔒 Security

- API keys are stored in environment variables
- `.env` file is excluded from version control
- No sensitive data is committed to the repository

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Places API for business data
- Expo team for the amazing development platform
- React Native community for excellent documentation

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Built with ❤️ for the Ravet community**
