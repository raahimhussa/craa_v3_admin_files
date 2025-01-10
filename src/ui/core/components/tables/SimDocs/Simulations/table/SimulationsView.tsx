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

  const handleDataGridChange = async (newDataGridContext: any) => {
    // console.log("Sim View 0: ", state, state.selectedRowIds)
    // console.log("tables SimulationsView 000: ", newDataGridContext)
    if(newDataGridContext && newDataGridContext.contextKey) {
      if(newDataGridContext.contextKey === 'sortBy') {
        setSortBy([newDataGridContext[0]]);
      }
      else if(newDataGridContext.contextKey === 'selectedRows') {
        // console.log("tables SimulationsView: ", newDataGridContext)
        // setSelectedRows(newDataGridContext.selectedRowIds);
        // setSelectedRows(newDataGridContext.selectedRows);
        setSelectedRows(newDataGridContext.selectedRows);
        // const selectedRowIds = state.observableValue2.get('selectedRowIds');
        // console.log("Sim View: ", state, selectedRowIds, await state.selectedRowIds)
        // console.log("Sim View: ", state, newDataGridContext, state.ObservableValue2, state.selectedRowIds)
      }
    }

      // console.log("newDataGridContext: ", newDataGridContext)
    

    
    // setSelectedRows(newSelectedRows);

    // const primarySort = newSortBy[0] || null;

    // if (primarySort) {
    //   const columnName = primarySort.id;
    //   const sortDirection = primarySort.desc ? 'desc' : 'asc';    
    // }    
  };

  return (
    <DataGrid
      state={state}
      columns={columns}
      leftButtons={leftButtons}
      // rightButtons={rightButtons}
      data={simulations}
      height={height}      
      onDataGridChange={handleDataGridChange}
    />
  )
}
export default observer(SimulationsView)
