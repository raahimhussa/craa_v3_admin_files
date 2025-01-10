// SortingContext.js
import React, { createContext, useContext, useState, ReactNode } from 'react';

// interface SortingContextType {
//     sortBy: any[]; // Replace `any` with the actual type you want to use for sorting
//     setSortBy: React.Dispatch<React.SetStateAction<any[]>>;
//   }

// const SortingContext = React.createContext<SortingContextType | null>({
//     sortBy: [], // or some default value appropriate for your application
//     setSortBy: () => {} // mock function, or perhaps () => throw new Error('must be overridden')
//   });
  
// const [sortBy, setSortBy] = useState<any[] | null>(null); // Assuming null is a valid state

// Update the interface if necessary
interface SortingContextType {
  sortBy: any[] | null;
//   setSortBy: React.Dispatch<React.SetStateAction<any[] | null>>;
  setSortBy: (sortBy: any) => void; 
}

const SortingContext = React.createContext<SortingContextType | null>(null);
  
type SortingContextProviderProps = {
    children: ReactNode;
  };

// const SortingContext = createContext(null);

// export const useSortingContext = () => useContext(SortingContext);

export const useSortingContext = () => {
    const context = useContext(SortingContext);
    if (!context) {
      throw new Error('useSortingContext must be used within a SortingProvider');
    }
    return context;
  };

export const SortingProvider = ({ children }: SortingContextProviderProps) => {

  const [sortBy, setSortBy] = useState<any[] | null>(null);

  return (
    <SortingContext.Provider value={{ sortBy, setSortBy }}>
      {children}
    </SortingContext.Provider>
  );
};
