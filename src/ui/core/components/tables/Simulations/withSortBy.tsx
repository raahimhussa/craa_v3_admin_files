// withSortBy.jsx
import React from 'react';
import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useSortingContext } from 'src/contexts/SortingContext';

const withSortBy: WrappingFunction = (WrappedComponent) =>
    observer((props) => {
 
        const { setSortBy } = useSortingContext();
          
        return <WrappedComponent {...props} setSortBy={setSortBy} />;      
    });

export default withSortBy;
