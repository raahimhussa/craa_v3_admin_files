import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
function UserBaselinesView({
  userSimulations,
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
      data={userSimulations}
    />
  )
}
export default observer(UserBaselinesView)
