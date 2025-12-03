import { useState, useEffect, useMemo } from 'react';
import { categories as localCategories } from '../api/categories';
import { fetchCategories } from '../api/backendApi';

export const useCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState(localCategories);

  const categoriesList = useMemo(() => categories, [categories]);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const remoteCategories = await fetchCategories();
        if (isMounted && Array.isArray(remoteCategories) && remoteCategories.length > 0) {
          setCategories(remoteCategories);
        }
      } catch (error) {
        console.log('Failed to load categories from backend, using local fallback:', error);
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectCategory = (category) => {
    setSelectedCategory(category);
  };

  const clearSelectedCategory = () => {
    setSelectedCategory(null);
  };

  return {
    categories: categoriesList,
    selectedCategory,
    selectCategory,
    clearSelectedCategory,
  };
}; 