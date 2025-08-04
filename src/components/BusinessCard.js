import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getPlacePhoto } from '../api/placesApi';

const BusinessCard = ({ business, onPress }) => {
  // Get the first photo if available
  let photoUrl = null;
  try {
    if (business.photos && business.photos.length > 0 && business.photos[0].photo_reference) {
      photoUrl = getPlacePhoto(business.photos[0].photo_reference);
    } else {
      photoUrl = 'https://via.placeholder.com/400x200?text=No+Image';
    }
  } catch (error) {
    console.error('Error getting photo URL:', error);
    photoUrl = 'https://via.placeholder.com/400x200?text=Error';
  }

  // Format rating to display stars
  const renderRating = () => {
    if (!business.rating) return null;
    
    const fullStars = Math.floor(business.rating);
    const halfStar = business.rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <View style={styles.ratingContainer}>
        {[...Array(fullStars)].map((_, i) => (
          <FontAwesome key={`full-${i}`} name="star" size={14} color="#f39c12" style={styles.starIcon} />
        ))}
        {halfStar && <FontAwesome name="star-half-o" size={14} color="#f39c12" style={styles.starIcon} />}
        {[...Array(emptyStars)].map((_, i) => (
          <FontAwesome key={`empty-${i}`} name="star-o" size={14} color="#f39c12" style={styles.starIcon} />
        ))}
        <Text style={styles.ratingText}>{business.rating.toFixed(1)}</Text>
      </View>
    );
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(business)} activeOpacity={0.8}>
      <View style={styles.cardContent}>
        {photoUrl ? (
          <Image source={{ uri: photoUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <FontAwesome name="building" size={40} color="#ddd" />
          </View>
        )}
        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={1}>{business.name}</Text>
          <Text style={styles.address} numberOfLines={2}>{business.vicinity || business.formatted_address}</Text>
          {renderRating()}
          {business.opening_hours && (
            <View style={styles.openStatusContainer}>
              <View style={[styles.statusDot, { backgroundColor: business.opening_hours.open_now ? '#2ecc71' : '#e74c3c' }]} />
              <Text style={styles.openStatusText}>
                {business.opening_hours.open_now ? 'Open Now' : 'Closed'}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  starIcon: {
    marginRight: 2,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  openStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  openStatusText: {
    fontSize: 12,
    color: '#666',
  },
});

export default BusinessCard;