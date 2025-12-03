import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import BusinessListScreen from '../screens/BusinessListScreen';

// Simple navigation context for web
const NavigationContext = React.createContext();

export const useNavigation = () => React.useContext(NavigationContext);

const AppNavigator = () => {
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [params, setParams] = useState({});

  // Navigation functions
  const navigation = {
    navigate: (screenName, screenParams = {}) => {
      setCurrentScreen(screenName);
      setParams(screenParams);
    },
    goBack: () => setCurrentScreen('Home'),
    setParams: (newParams) => setParams({...params, ...newParams}),
    getParam: (paramName, defaultValue) => params[paramName] || defaultValue,
  };

  // Render the current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return <HomeScreen navigation={navigation} />;
      case 'BusinessList':
        return <BusinessListScreen navigation={navigation} route={{ params }} />;
      default:
        return <HomeScreen navigation={navigation} />;
    }
  };

  return (
    <NavigationContext.Provider value={navigation}>
      <View style={styles.container}>
        {renderScreen()}
      </View>
    </NavigationContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default AppNavigator;