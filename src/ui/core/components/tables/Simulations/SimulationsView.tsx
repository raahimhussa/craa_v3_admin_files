import { useSortingContext } from 'src/contexts/SortingContext';

import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
function SimulationsView({
  simulations,
  columns,
  state,
  leftButtons,
  rightButtons,
  height,
  setSortBy,
  setSelectedRows,
}: any) {  

  // const handleSortChange = (newSortBy: any) => {
  //   setSortBy(newSortBy);

  //   const primarySort = newSortBy[0] || null;

  //   if (primarySort) {
  //     const columnName = primarySort.id;
  //     const sortDirection = primarySort.desc ? 'desc' : 'asc';    
  //   }    
  // };
  const handleDataGridChange = async (newDataGridContext: any) => {
    if(newDataGridContext && newDataGridContext.contextKey) {
      if(newDataGridContext.contextKey === 'sortBy') {
        setSortBy([newDataGridContext[0]]);
      }
      else if(newDataGridContext.contextKey === 'selectedRows') {
        setSelectedRows(newDataGridContext.selectedRows);
      }
    }   
  };  

  return (
    <DataGrid
      state={state}
      columns={columns}
      leftButtons={leftButtons}
      rightButtons={rightButtons}
      data={simulations}
      height={height}
      // onSortChange={state.onSortChange}
      // onSortChange={handleSortChange}
      onDataGridChange={handleDataGridChange}
    />
  )
}
export default observer(SimulationsView)
