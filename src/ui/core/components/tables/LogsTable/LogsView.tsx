import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
import { Box } from '@mui/material'
function LogsView({ logs, columns, state, leftButtons, rightButtons }: any) {
  return (
    <Box
      sx={{
        height: 'calc(100vh - 200px)',
        overflowY: 'auto',
      }}
    >
      <DataGrid
        buttons={false}
        state={state}
        columns={columns}
        leftButtons={leftButtons}
        rightButtons={rightButtons}
        data={logs}
      />
    </Box>
  )
}
export default observer(LogsView)
