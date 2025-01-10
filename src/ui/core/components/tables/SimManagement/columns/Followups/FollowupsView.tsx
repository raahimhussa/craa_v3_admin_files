import AssessmentTypes from 'src/ui/core/components/tables/AssessmentTypes/AssessmentTypes'
import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
function FollowupsView({ userSimulations, columns, state }: any) {
  return (
    <DataGrid
      columns={columns}
      data={userSimulations}
      state={state}
      isSubTable={true}
    />
  )
}
export default observer(FollowupsView)
