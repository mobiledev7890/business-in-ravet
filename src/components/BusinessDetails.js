import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getPlacePhoto } from '../api/placesApi';
import { useBusinessDetails } from '../hooks/useBusinessDetails';

const BusinessDetails = ({ business, onClose }) => {
  const { details, loading, error, retry } = useBusinessDetails(business);

  const openMap = () => {
    if (details?.geometry) {
      const { lat, lng } = details.geometry.location;
      const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${business.place_id}`;
      Linking.openURL(url);
    }
  };

  const callBusiness = () => {
    if (details?.formatted_phone_number) {
      Linking.openURL(`tel:${details.formatted_phone_number}`);
    }
  };

  const openWebsite = () => {
    if (details?.website) {
      Linking.openURL(details.website);
    }
  };

  const renderOpeningHours = () => {
    if (!details?.opening_hours?.weekday_text) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Opening Hours</Text>
        {details.opening_hours.weekday_text.map((day, index) => (
          <Text key={index} style={styles.openingHoursText}>{day}</Text>
        ))}
      </View>
    );
  };

  const renderPhotos = () => {
    if (!details?.photos?.length) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Photos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoScroll}>
          {details.photos.slice(0, 5).map((photo, index) => (
            <Image 
              key={index} 
              source={{ uri: getPlacePhoto(photo.photo_reference, 400) }} 
              style={styles.photo} 
            />
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderReviews = () => {
    if (!details?.reviews?.length) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reviews</Text>
        {details.reviews.slice(0, 3).map((review, index) => (
          <View key={index} style={styles.reviewContainer}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewAuthor}>{review.author_name}</Text>
              <View style={styles.reviewRating}>
                {[...Array(5)].map((_, i) => (
                  <FontAwesome 
                    key={i} 
                    name={i < review.rating ? "star" : "star-o"} 
                    size={12} 
                    color="#f39c12" 
                  />
                ))}
              </View>
            </View>
            <Text style={styles.reviewText}>{review.text}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderLoadingContent = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#3498db" />
      <Text style={styles.loadingText}>Loading business details...</Text>
    </View>
  );

  const renderErrorContent = () => (
    <View style={styles.errorContainer}>
      <FontAwesome name="exclamation-circle" size={40} color="#e74c3c" />
      <Text style={styles.errorText}>Failed to load business details</Text>
      <TouchableOpacity style={styles.retryButton} onPress={retry}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) return renderLoadingContent();
  if (error) return renderErrorContent();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <FontAwesome name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Business Details</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.businessInfo}>
          <Text style={styles.businessName}>{business.name}</Text>
          <Text style={styles.businessAddress}>{business.vicinity || business.formatted_address}</Text>
          
          {business.rating && (
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={16} color="#f39c12" />
              <Text style={styles.ratingText}>{business.rating.toFixed(1)}</Text>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          {details?.formatted_phone_number && (
            <TouchableOpacity style={styles.actionButton} onPress={callBusiness}>
              <FontAwesome name="phone" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Call</Text>
            </TouchableOpacity>
          )}
          
          {details?.website && (
            <TouchableOpacity style={styles.actionButton} onPress={openWebsite}>
              <FontAwesome name="globe" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Website</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.actionButton} onPress={openMap}>
            <FontAwesome name="map-marker" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Directions</Text>
          </TouchableOpacity>
        </View>

        {renderOpeningHours()}
        {renderPhotos()}
        {renderReviews()}
      </ScrollView>
    </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  businessInfo: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  businessName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  businessAddress: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  section: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  openingHoursText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  photoScroll: {
    marginTop: 8,
  },
  photo: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginRight: 12,
  },
  reviewContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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

export default BusinessDetails;