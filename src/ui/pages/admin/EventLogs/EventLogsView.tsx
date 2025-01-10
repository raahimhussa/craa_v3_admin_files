import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
function TrainingsView({ eventLogs, columns, state, leftButtons, rightButtons }: any) {
  return (
    <div>
      <DataGrid
        state={state}
        columns={columns}
        leftButtons={leftButtons}
        rightButtons={rightButtons}
        data={eventLogs}
      />
    </div>
  )
}
export default observer(TrainingsView)
