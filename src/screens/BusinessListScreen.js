import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import BusinessCard from '../components/BusinessCard';
import BusinessDetails from '../components/BusinessDetails';
import { searchPlaces } from '../api/placesApi';

const BusinessListScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`Fetching businesses for category: ${category.title}`);
        console.log(`Search term: ${category.searchTerm}, Place type: ${category.placeType}`);
        
        const results = await searchPlaces(category.searchTerm, category.placeType);
        
        if (!results || results.length === 0) {
          console.log('No results found for this category');
        } else {
          console.log(`Found ${results.length} businesses`);
        }
        
        setBusinesses(results || []);
      } catch (err) {
        console.error('Error fetching businesses:', err);
        setError(`Failed to load businesses: ${err.message || 'Unknown error'}. Please check your API key and try again.`);
        
        // If it's a CORS error, provide more specific guidance
        if (err.message && err.message.includes('CORS')) {
          setError('CORS error detected. You need to enable CORS on the server or use a CORS proxy. ' +
            'For the CORS Anywhere proxy, visit https://cors-anywhere.herokuapp.com/corsdemo to request temporary access.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [category]);

  const handleBusinessPress = (business) => {
    setSelectedBusiness(business);
  };

  const handleBackPress = () => {
    setSelectedBusiness(null);
  };

  // If a business is selected, show its details
  if (selectedBusiness) {
    return <BusinessDetails business={selectedBusiness} onClose={handleBackPress} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{category.title}</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Loading businesses...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <FontAwesome name="exclamation-circle" size={40} color="#e74c3c" />
          <Text style={styles.errorText}>{error}</Text>
          
          {error && error.includes('CORS') && (
            <TouchableOpacity 
              style={styles.corsButton}
              onPress={() => {
                // Open CORS Anywhere demo page in a new tab
                window.open('https://cors-anywhere.herokuapp.com/corsdemo', '_blank');
              }}
            >
              <Text style={styles.corsButtonText}>Request CORS Access</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              setLoading(true);
              searchPlaces(category.searchTerm, category.placeType)
                .then(results => {
                  setBusinesses(results);
                  setLoading(false);
                })
                .catch(err => {
                  console.error('Error fetching businesses:', err);
                  
                  // If it's a CORS error, provide more specific guidance
                  if (err.message && err.message.includes('CORS')) {
                    setError('CORS error detected. To use the Google Places API in the browser, you need to request temporary access to the CORS Anywhere proxy. ' +
                      'Click the "Request CORS Access" button below, then click the "Request temporary access" button on the opened page. ' +
                      'After getting access, return here and click "Retry".');
                  } else {
                    setError(`Failed to load businesses: ${err.message || 'Unknown error'}. Please try again.`);
                  }
                  
                  setLoading(false);
                });
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : businesses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome name="search" size={40} color="#95a5a6" />
          <Text style={styles.emptyText}>No businesses found in this category</Text>
        </View>
      ) : (
        <FlatList
          data={businesses}
          renderItem={({ item }) => (
            <BusinessCard business={item} onPress={handleBusinessPress} />
          )}
          keyExtractor={(item) => item.place_id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
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
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  corsButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
  },
  corsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  listContent: {
    paddingVertical: 8,
  },
});

export default BusinessListScreen;