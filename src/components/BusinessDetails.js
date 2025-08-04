import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getPlaceDetails, getPlacePhoto } from '../api/placesApi';

const BusinessDetails = ({ business, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (business && business.place_id) {
        try {
          setLoading(true);
          const placeDetails = await getPlaceDetails(business.place_id);
          setDetails(placeDetails);
        } catch (error) {
          console.error('Error in fetchDetails:', error);
          // Show error to user
          alert(`Error fetching business details: ${error.message}`);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDetails();
  }, [business]);

  const openMap = () => {
    if (details && details.geometry) {
      const { lat, lng } = details.geometry.location;
      const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${business.place_id}`;
      Linking.openURL(url);
    }
  };

  const callBusiness = () => {
    if (details && details.formatted_phone_number) {
      Linking.openURL(`tel:${details.formatted_phone_number}`);
    }
  };

  const openWebsite = () => {
    if (details && details.website) {
      Linking.openURL(details.website);
    }
  };

  // Format opening hours
  const renderOpeningHours = () => {
    if (!details || !details.opening_hours || !details.opening_hours.weekday_text) {
      return null;
    }

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Opening Hours</Text>
        {details.opening_hours.weekday_text.map((day, index) => (
          <Text key={index} style={styles.openingHoursText}>{day}</Text>
        ))}
      </View>
    );
  };

  // Render photos
  const renderPhotos = () => {
    if (!details || !details.photos || details.photos.length === 0) {
      return null;
    }

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

  // Render reviews
  const renderReviews = () => {
    if (!details || !details.reviews || details.reviews.length === 0) {
      return null;
    }

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reviews</Text>
        {details.reviews.slice(0, 3).map((review, index) => (
          <View key={index} style={styles.reviewContainer}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewAuthor}>{review.author_name}</Text>
              <View style={styles.ratingContainer}>
                {[...Array(5)].map((_, i) => (
                  <FontAwesome 
                    key={i} 
                    name={i < review.rating ? "star" : "star-o"} 
                    size={14} 
                    color="#f39c12" 
                    style={styles.starIcon} 
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading business details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <FontAwesome name="arrow-left" size={24} color="#333" />
      </TouchableOpacity>

      {/* Header with main photo */}
      {details && details.photos && details.photos.length > 0 ? (
        <Image 
          source={{ uri: getPlacePhoto(details.photos[0].photo_reference, 600) }} 
          style={styles.headerImage} 
        />
      ) : (
        <View style={[styles.headerImage, styles.placeholderHeader]}>
          <FontAwesome name="building" size={60} color="#ddd" />
        </View>
      )}

      {/* Business name and rating */}
      <View style={styles.headerInfo}>
        <Text style={styles.businessName}>{business.name}</Text>
        {business.rating && (
          <View style={styles.ratingContainer}>
            {[...Array(5)].map((_, i) => (
              <FontAwesome 
                key={i} 
                name={i < Math.floor(business.rating) ? "star" : (i < Math.ceil(business.rating) && business.rating % 1 >= 0.5 ? "star-half-o" : "star-o")} 
                size={18} 
                color="#f39c12" 
                style={styles.starIcon} 
              />
            ))}
            <Text style={styles.ratingText}>{business.rating.toFixed(1)}</Text>
          </View>
        )}
      </View>

      {/* Action buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={openMap}>
          <FontAwesome name="map-marker" size={24} color="#3498db" />
          <Text style={styles.actionButtonText}>Directions</Text>
        </TouchableOpacity>

        {details && details.formatted_phone_number && (
          <TouchableOpacity style={styles.actionButton} onPress={callBusiness}>
            <FontAwesome name="phone" size={24} color="#2ecc71" />
            <Text style={styles.actionButtonText}>Call</Text>
          </TouchableOpacity>
        )}

        {details && details.website && (
          <TouchableOpacity style={styles.actionButton} onPress={openWebsite}>
            <FontAwesome name="globe" size={24} color="#9b59b6" />
            <Text style={styles.actionButtonText}>Website</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Address */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Address</Text>
        <Text style={styles.addressText}>
          {details ? details.formatted_address : business.vicinity}
        </Text>
      </View>

      {/* Opening hours */}
      {renderOpeningHours()}

      {/* Photos */}
      {renderPhotos()}

      {/* Reviews */}
      {renderReviews()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  closeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    width: '100%',
    height: 200,
  },
  placeholderHeader: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    padding: 16,
  },
  businessName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginRight: 2,
  },
  ratingText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginHorizontal: 16,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionButtonText: {
    marginTop: 8,
    color: '#666',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  openingHoursText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  photoScroll: {
    flexDirection: 'row',
    marginTop: 8,
  },
  photo: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginRight: 8,
  },
  reviewContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
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
  reviewText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default BusinessDetails;