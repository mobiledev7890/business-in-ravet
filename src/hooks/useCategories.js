import { useState, useMemo } from 'react';
import { categories } from '../api/categories';

export const useCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categoriesList = useMemo(() => categories, []);

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