import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'

function VendorsView({ vendors, columns, state, leftButtons, rightButtons, ...rest }: any) {
  return (
    <DataGrid
      {...rest}
      state={state}
      columns={columns}
      leftButtons={leftButtons}
      rightButtons={rightButtons}
      data={vendors}
    />
  )
}
export default observer(VendorsView)
