import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
function DocumentsWithoutButtonsView({
  documents,
  columns,
  state,
  rightButtons,
  ...rest
}: any) {
  return (
    <DataGrid
      {...rest}
      state={state}
      columns={columns}
      // rightButtons={rightButtons}
      data={documents}
    />
  )
}
export default observer(DocumentsWithoutButtonsView)
