import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
function BusinessUnitsView({
  businessUnits,
  columns,
  state,
  leftButtons,
  rightButtons,
  ...rest
}: any) {
  return (
    <DataGrid
      {...rest}
      // buttons={false}
      state={state}
      columns={columns}
      leftButtons={leftButtons}
      rightButtons={rightButtons}
      data={businessUnits}
      // isSubTable={true}
    />
  )
}
export default observer(BusinessUnitsView)
