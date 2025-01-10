import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
import { useEffect } from 'react'
import { useRootStore } from 'src/stores'
function FindingsView({
  findings,
  columns,
  state,
  leftButtons,
  rightButtons,
  clientUnits,
  assessmentCycles,
  assessmentTypes,
  ...rest
}: any) {
  return (
    <DataGrid
      {...rest}
      state={state}
      columns={columns}
      leftButtons={leftButtons}
      rightButtons={rightButtons}
      data={findings}
      height={'calc(100vh - 232px)'}
    />
  )
}
export default observer(FindingsView)
