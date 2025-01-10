import SimResourceChangeLog from 'src/ui/core/components/tables/SimResourceChangeLog/SimResourceChangeLog'
import PaginationTable from 'src/ui/components/PaginationTable'
import { observer } from 'mobx-react'
function SimResourceChangeLogView(props: any) {
  return (
    <PaginationTable
      collectionName={'adminLogs'}
      Table={SimResourceChangeLog}
      version={2}
      params={{
        filter: { screen: 'simResources' },
        options: {sort: { createdAt: -1 } },
      }}
      height={'calc(100vh - 240px)'}
      adminUsers={props.adminUsers}
    />
  )
}
export default observer(SimResourceChangeLogView)
