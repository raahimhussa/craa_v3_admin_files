import AssessmentTypes from 'src/ui/core/components/tables/AssessmentTypes/AssessmentTypes'
import PaginationTable from 'src/ui/components/PaginationTable'
import { observer } from 'mobx-react'
function AssessmentTypesView(props: any) {
  return (
    <PaginationTable
      collectionName={'assessmentTypes'}
      Table={AssessmentTypes}
      version={1}
      params={{
        filter: { isDeleted: false },
        options: { multi: true, sort: { createdAt: -1 } },
      }}
      height={'calc(100vh - 240px)'}
    />
  )
}
export default observer(AssessmentTypesView)
