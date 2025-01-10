import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
function FilesView({
  files,
  columns,
  state,
  leftButtons,
  rightButtons,
  ...rest
}: any) {
  return (
    <DataGrid
      {...rest}
      state={state}
      columns={columns}
      leftButtons={leftButtons}
      rightButtons={rightButtons}
      data={files}
    />
  )
}
export default observer(FilesView)
