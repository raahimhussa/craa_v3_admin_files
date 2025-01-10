import { Box } from '@mui/material'
import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
function TrainingLogsView({
  data,
  columns,
  state,
  leftButtons,
  rightButtons,
}: any) {
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
        data={data}
      />
    </Box>
  )
}
export default observer(TrainingLogsView)
