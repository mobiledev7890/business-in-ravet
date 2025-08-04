import React from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import BusinessCard from '../components/BusinessCard';
import BusinessDetails from '../components/BusinessDetails';
import { useBusinesses } from '../hooks/useBusinesses';
import { useSelectedBusiness } from '../hooks/useSelectedBusiness';

const BusinessListScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const { businesses, loading, error, retry } = useBusinesses(category);
  const { selectedBusiness, selectBusiness, clearSelectedBusiness } = useSelectedBusiness();

  if (selectedBusiness) {
    return <BusinessDetails business={selectedBusiness} onClose={clearSelectedBusiness} />;
  }

  const renderBusinessItem = ({ item }) => (
    <BusinessCard business={item} onPress={selectBusiness} />
  );

  const renderErrorContent = () => (
    <View style={styles.errorContainer}>
      <FontAwesome name="exclamation-circle" size={40} color="#e74c3c" />
      <Text style={styles.errorText}>{error}</Text>
      
      <TouchableOpacity style={styles.retryButton} onPress={retry}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoadingContent = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#3498db" />
      <Text style={styles.loadingText}>Loading businesses...</Text>
    </View>
  );

  const renderBusinessList = () => (
    <FlatList
      data={businesses}
      renderItem={renderBusinessItem}
      keyExtractor={(item) => item.place_id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{category.title}</Text>
      </View>

      {loading ? renderLoadingContent() : error ? renderErrorContent() : renderBusinessList()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  listContainer: {
    paddingVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    marginBottom: 24,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BusinessListScreen;