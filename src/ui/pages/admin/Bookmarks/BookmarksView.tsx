import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
function BookmarksView({ bookmarks = [], columns, state, leftButtons, rightButtons }: any) {
  return (
    <div>
      <DataGrid
        state={state}
        columns={columns}
        leftButtons={leftButtons}
        rightButtons={rightButtons}
        data={state.bookmarks}
      />
    </div>
  )
}
export default observer(BookmarksView)
