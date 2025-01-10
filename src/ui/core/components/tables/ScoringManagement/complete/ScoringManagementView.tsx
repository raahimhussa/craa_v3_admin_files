import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
function AssessmentsView({
  data,
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
      data={data}
      height={height}
    />
  )
}
export default observer(AssessmentsView)
