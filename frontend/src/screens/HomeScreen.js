import React, { useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryCard from '../components/CategoryCard';
import { useCategories } from '../hooks/useCategories';

const HomeScreen = ({ navigation }) => {
  const { categories } = useCategories();

  const handleCategoryPress = useCallback(
    (category) => {
      navigation.navigate('BusinessList', { category });
    },
    [navigation],
  );

  const renderCategoryItem = useCallback(
    ({ item }) => <CategoryCard category={item} onPress={handleCategoryPress} />,
    [handleCategoryPress],
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <Text style={styles.title}>Business in Ravet</Text>
        <Text style={styles.subtitle}>Find local businesses in Ravet, Pune</Text>
      </View>
      
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        windowSize={5}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No categories available.</Text>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    padding: 8,
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    color: '#666',
    fontSize: 16,
  },
});

export default HomeScreen;