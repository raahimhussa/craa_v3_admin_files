// withSortBy.jsx
import React from 'react';
import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useSortingContext } from 'src/contexts/SortingContext';
import { useDataGridContext } from 'src/contexts/DataGridContext';

const withDataGridContext: WrappingFunction = (WrappedComponent) =>
    observer((props) => {
 
        const { setSortBy, _setSelectedRows } = useDataGridContext();
          
        return <WrappedComponent {...props} setSortBy={setSortBy} setSelectedRows={_setSelectedRows} />;      
    });

export default withDataGridContext;
