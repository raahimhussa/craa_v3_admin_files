import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
function DocumentVariablesView({
  documentVariables,
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
      // rightButtons={rightButtons}
      data={documentVariables}
    />
  )
}
export default observer(DocumentVariablesView)
