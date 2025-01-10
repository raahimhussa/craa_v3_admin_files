import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
function RolesView({ roles, columns, state, leftButtons, rightButtons, ...rest }: any) {
  return (
    <DataGrid
      {...rest}
      state={state}
      columns={columns}
      leftButtons={leftButtons}
      rightButtons={rightButtons}
      data={roles}
    />
  )
}
export default observer(RolesView)
