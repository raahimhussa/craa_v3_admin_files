import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
function AgreementsView({ agreements, columns, state, leftButtons, rightButtons }: any) {
  return (
    <DataGrid
      state={state}
      columns={columns}
      leftButtons={leftButtons}
      rightButtons={rightButtons}
      data={agreements}
    />
  )
}
export default observer(AgreementsView)
