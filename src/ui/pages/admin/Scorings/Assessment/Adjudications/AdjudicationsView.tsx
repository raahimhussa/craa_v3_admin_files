import { Box, useTheme } from '@mui/material'

import Assessment from '../Assessment'
import { AssessmentStatus } from 'src/utils/status'
import CompleteAdjudications from '@components/tables/Adjudications/complete/Adjudications'
import InProgressAdjudications from '@components/tables/Adjudications/inProgress/Adjudications'
import PaginationTable from 'src/ui/components/PaginationTable'
import { observer } from 'mobx-react'
import { useUser } from '@hooks'

// assessmentId 필요
function AdjudicationsView(props: any) {
  const { data } = useUser()
  return (
    <>
      <PaginationTable
        collectionName="assessments"
        Table={InProgressAdjudications}
        version={2}
        params={{
          filter: {
            isDeleted: false,
            'adjudicator._id': data._id,
            'adjudicator.status': {
              $in: [AssessmentStatus.InProgress, AssessmentStatus.Pending],
            },
          },
          // Original 'find' not working, this is not needed any more
          // See API v1 'assessments.repository::find' for more details
          // projection: {
          //   'userSimulation.user.name': 1,
          //   'userSimulation.user.profile.initial': 1,
          //   'userSimulation.simulation.name': 1,
          //   'firstScorer.status': 1,
          //   'secondScorer.status': 1,
          //   'adjudicator.status': 1,
          //   'userSimulation.status': 1,
          // },
          options: {
            // withoutLookup: true,
            limit: 10, // See API v1 'assessments.repository::count'
          },
        }}
      />
      <PaginationTable
        collectionName="assessments"
        Table={CompleteAdjudications}
        version={2}
        params={{
          filter: {
            isDeleted: false,
            'adjudicator._id': data._id,
            'adjudicator.status': AssessmentStatus.Complete,
          },
          options: {            
            limit: 10,
          },          
        }}
      />
    </>
  )
}

export default observer(AdjudicationsView)
