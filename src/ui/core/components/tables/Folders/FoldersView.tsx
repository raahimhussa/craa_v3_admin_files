import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
function FoldersView({ folders, columns, state, leftButtons, rightButtons, ...rest }: any) {
  return (
    <DataGrid
      {...rest}
      state={state}
      columns={columns}
      leftButtons={leftButtons}
      rightButtons={rightButtons}
      data={folders}
    />
  )
}
export default observer(FoldersView)
