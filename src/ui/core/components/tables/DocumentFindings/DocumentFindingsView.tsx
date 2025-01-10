import { Box } from '@mui/material'
import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
function DocumentFindingsView({
  findings,
  columns,
  state,
  leftButtons,
  rightButtons,
  simulationMappers,
  ...rest
}: any) {
  return (
    <DataGrid
      {...rest}
      state={state}
      columns={columns}
      leftButtons={leftButtons}
      rightButtons={rightButtons}
      data={findings}
    />
  )
}
export default observer(DocumentFindingsView)
