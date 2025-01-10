import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
function StudyDocumentsView({
  studyDocuments,
  columns,
  state,
  leftButtons,
  rightButtons,
}: any) {
  return (
    <DataGrid
      state={state}
      columns={columns}
      leftButtons={leftButtons}
      rightButtons={rightButtons}
      data={studyDocuments}
    />
  )
}
export default observer(StudyDocumentsView)
