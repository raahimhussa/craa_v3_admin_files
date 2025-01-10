import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
import { Box } from '@mui/material'
function TrainingLogsView({
  trainingLogs,
  columns,
  state,
  leftButtons,
  rightButtons,
}: any) {
  console.log(trainingLogs)
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
        data={trainingLogs}
      />
    </Box>
  )
}
export default observer(TrainingLogsView)
