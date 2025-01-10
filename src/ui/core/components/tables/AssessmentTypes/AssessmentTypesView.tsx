import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
function AssessmentTypesView({
  assessmentTypes,
  columns,
  state,
  leftButtons,
  rightButtons,
  height,
}: any) {
  return (
    <DataGrid
      state={state}
      columns={columns}
      leftButtons={leftButtons}
      rightButtons={rightButtons}
      data={assessmentTypes}
      height={height}
    />
  )
}
export default observer(AssessmentTypesView)
