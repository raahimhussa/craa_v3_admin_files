import React, { useState } from 'react';
import PaginationTable from 'src/ui/components/PaginationTable'
import Simulations from 'src/ui/core/components/tables/Simulations/Simulations'
import { observer } from 'mobx-react'

import { SortingProvider, useSortingContext } from 'src/contexts/SortingContext'

import SearchBar from './SearchBar/SearchBar';
import Box from '@mui/material/Box'

// @ts-ignore
const SimulationsView = observer((props) => {

  // Inner component to utilize context within the provider
  const InnerSimulationsView = () => {
    const { sortBy } = useSortingContext();
    
    const [searchString, setSearchString] = useState<string>('')

    const searchStringFilter = {
      $or: [
        { 'name': { $regex: searchString, $options: 'i' } },
      ],
    }

    return (
      <>
      <Box
        sx={{
          display: 'flex',
          backgroundColor: 'white',
          position: 'absolute',
          // transform: 'translate(-50%, 0%)',
          mt: 2,
          zIndex: 1000,
        }}
      >
      <SearchBar
        searchString={searchString}
        onChange={(e: any) => setSearchString(e.target.value)}
      />
      </Box>       
      <PaginationTable
        collectionName="simulations"
        version={1}
        params={{
          filter: { isDeleted: false, ...searchStringFilter, },
          options: { multi: true },
          sortBy, // sortBy from context
        }}
        height={'calc(100vh - 210px)'}
        Table={Simulations}
      />
      </>
    );
  };
  
  return (
    <SortingProvider>
      <InnerSimulationsView />
    </SortingProvider>  
  );
});

export default SimulationsView;
