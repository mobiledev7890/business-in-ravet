import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import the appropriate navigator based on platform
let AppNavigator;
if (Platform.OS === 'web') {
  AppNavigator = require('./src/navigation/AppNavigator.web').default;
} else {
  AppNavigator = require('./src/navigation/AppNavigator').default;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
