import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'

function KeyConceptsView({
  domains,
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
      data={domains}
      height={'calc(100vh - 320px)'}
    />
  )
}
export default observer(KeyConceptsView)
