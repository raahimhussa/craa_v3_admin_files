import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
function UserAssessmentCyclesView({
  userAssessmentCycles,
  columns,
  state,
  leftButtons,
  rightButtons,
}: any) {
  return (
    <DataGrid
      buttons={false}
      state={state}
      columns={columns}
      leftButtons={leftButtons}
      rightButtons={rightButtons}
      data={userAssessmentCycles}
    />
  )
}
export default observer(UserAssessmentCyclesView)
