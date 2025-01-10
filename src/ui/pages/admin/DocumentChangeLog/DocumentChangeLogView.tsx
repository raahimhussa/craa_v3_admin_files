import DocumentChangeLog from 'src/ui/core/components/tables/DocumentChangeLog/DocumentChangeLog'
import PaginationTable from 'src/ui/components/PaginationTable'
import { observer } from 'mobx-react'
function DocumentChangeLogView(props: any) {
  return (
    <PaginationTable
      collectionName={'adminLogs'}
      Table={DocumentChangeLog}
      version={2}
      params={{
        filter: { screen: 'pdfFiles' },
        options: {sort: { createdAt: -1 } },
      }}
      height={'calc(100vh - 240px)'}
      adminUsers={props.adminUsers}
    />
  )
}
export default observer(DocumentChangeLogView)
