import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
function NotesView({ notes = [], columns, state, leftButtons, rightButtons }: any) {
  return (
    <div>
      <DataGrid
        state={state}
        columns={columns}
        leftButtons={leftButtons}
        rightButtons={rightButtons}
        data={notes}
      />
    </div>
  )
}
export default observer(NotesView)