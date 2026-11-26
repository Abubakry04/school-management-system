import React, { createContext, useContext } from 'react';
import { useSchoolStore, SchoolState } from '../store/useSchoolStore';

// DataContext bridges useData calls directly to the Zustand store
const DataContext = createContext<SchoolState | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useSchoolStore();

  return (
    <DataContext.Provider value={store}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): SchoolState => {
  // Use Zustand directly so state is always fresh and reactive
  return useSchoolStore();
};
