import Box from '@components/mui/layout/Box/Box'
import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
function UserStatusView({
  userStatusManagement,
  columns,
  state,
  leftButtons,
  rightButtons,
  height,
}: any) {
  return (
    <DataGrid
      buttons={false}
      state={state}
      columns={columns}
      leftButtons={leftButtons}
      rightButtons={rightButtons}
      data={userStatusManagement}
      height={height}
    />
  )
}
export default observer(UserStatusView)
