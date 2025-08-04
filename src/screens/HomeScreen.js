import React from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, StatusBar } from 'react-native';
import CategoryCard from '../components/CategoryCard';
import { categories } from '../api/categories';

const HomeScreen = ({ navigation }) => {
  const handleCategoryPress = (category) => {
    navigation.navigate('BusinessList', { category });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <Text style={styles.title}>Business in Ravet</Text>
        <Text style={styles.subtitle}>Find local businesses in Ravet, Pune</Text>
      </View>
      
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <CategoryCard category={item} onPress={handleCategoryPress} />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
});

export default HomeScreen;