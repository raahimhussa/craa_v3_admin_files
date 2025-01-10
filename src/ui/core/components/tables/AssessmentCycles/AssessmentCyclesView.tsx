import Box from '@mui/material/Box'
import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
function AssessmentCyclesView({
  assessmentCycles,
  columns,
  state,
  leftButtons,
  rightButtons,
  height,
}: any) {
  return (
    <>
      <Box
        sx={{
          // height: 'calc(100vh - 130px)',
          overflowY: 'auto',
        }}
      ></Box>    
      <DataGrid
        state={state}
        columns={columns}
        leftButtons={leftButtons}
        rightButtons={rightButtons}
        data={assessmentCycles}
        height={height}
      />
    </>
  )
}
export default observer(AssessmentCyclesView)
