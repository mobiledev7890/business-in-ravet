import { useState } from 'react';

export const useSelectedBusiness = () => {
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const selectBusiness = (business) => {
    setSelectedBusiness(business);
  };

  const clearSelectedBusiness = () => {
    setSelectedBusiness(null);
  };

  return {
    selectedBusiness,
    selectBusiness,
    clearSelectedBusiness,
  };
}; 