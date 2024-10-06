import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useFilter = () => {
  const { user } = useAuthContext();
  const [currentFilter, setCurrentFilter] = useState('all');

  const changeFilter = (newFilter) => {
    setCurrentFilter(newFilter);
  };

  const filterArray = (array) => {
    return array.filter((obj) => {
      switch (currentFilter) {
        default:
        case 'all':
          return true;
        case 'mine':
          let assignedToMe = false;
          obj.assignedUsersList.forEach((u) => {
            if (u.id === user.uid) {
              assignedToMe = true;
            }
          });
          return assignedToMe;
        case 'development':
        case 'design':
        case 'sales':
        case 'marketing':
          return obj.category === currentFilter;
      }
    });
  };

  return {
    currentFilter,
    changeFilter,
    filterArray
  };
};