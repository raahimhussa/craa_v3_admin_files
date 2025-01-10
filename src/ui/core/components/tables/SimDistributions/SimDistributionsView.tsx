import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
import { Box } from '@mui/material'
function SimDistributionsView({
  simDistribution,
  columns,
  state,
  leftButtons,
  rightButtons,
}: any) {
  return (
    <Box
      sx={{
        height: 'calc(100vh - 130px)',
        overflowY: 'auto',
      }}
    >
      <DataGrid
        state={state}
        columns={columns}
        leftButtons={leftButtons}
        rightButtons={rightButtons}
        data={simDistribution}
      />
    </Box>
  )
}
export default observer(SimDistributionsView)
