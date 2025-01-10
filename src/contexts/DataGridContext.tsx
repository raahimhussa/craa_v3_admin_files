import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the combined context type
interface DataGridContextType {
  // Sorting context properties
  sortBy: any[] | null;
  setSortBy: (sortBy: any[]) => void;

  // DataGrid context properties
  _selectedRows: any[]; // Replace 'any' with the specific type if needed
  _setSelectedRows: (rows: any[]) => void; // Replace 'any' with the specific type
}

// Create a default value for the combined context
const defaultDataGridContextValue: DataGridContextType = {
  sortBy: null,
  setSortBy: () => {},

  _selectedRows: [],
  _setSelectedRows: () => {},
};

// Create the combined context
const DataGridContext = createContext<DataGridContextType>(defaultDataGridContextValue);

type DataGridProviderProps = {
  children: ReactNode;
};


export const useDataGridContext = () => {
  const context = useContext(DataGridContext);
  if (!context) {
    throw new Error('useDataGridContext must be used within a DataGridProvider');
  }
  return context;
};

export const DataGridProvider = ({ children }: DataGridProviderProps) => {

const [sortBy, setSortBy] = useState<any[] | null>(null);
const [_selectedRows, _setSelectedRows] = useState<any[]>([]); // Replace 'any' with the specific type

const combinedStore: DataGridContextType = {
  sortBy,
  setSortBy,
  _selectedRows,
  _setSelectedRows,
};

return (
  <DataGridContext.Provider value={combinedStore}>
    {children}
  </DataGridContext.Provider>
);
};

// Combined provider component
// export const DataGridProvider = ({ children }: DataGridProviderProps) => {
//   const [sortBy, setSortBy] = useState<any[] | null>(null);
//   const [selectedRows, setSelectedRows] = useState<any[]>([]); // Replace 'any' with the specific type

//   const combinedStore: DataGridContextType = {
//     sortBy,
//     setSortBy,
//     selectedRows,
//     setSelectedRows,
//   };

//   return (
//     <DataGridContext.Provider value={combinedStore}>
//       {children}
//     </DataGridContext.Provider>
//   );
// };

// // Custom hook to use the combined context
// export const useDataGridStore = (): DataGridContextType => {
//   const context = useContext(DataGridContext);
//   if (!context) {
//     throw new Error('useDataGridStore must be used within a DataGridProvider');
//   }
//   return context;
// };
