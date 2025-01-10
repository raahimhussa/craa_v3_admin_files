import * as React from 'react'

import UserAssessmentCycle from 'src/models/userAssessmentCycle'
import compose from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { withFind } from '@hocs'

type Props = {
  userAssessmentCycles: (UserAssessmentCycle & any)[]
}

const UserName = observer(({ userAssessmentCycles }: Props) => {
  const userAssessmentCycle = userAssessmentCycles?.[0]
  if (!userAssessmentCycle) return null
  return <div>{userAssessmentCycle.user.name}</div>
})

export default compose<any>(
  withFind({
    collectionName: 'userAssessmentCycles',
    getFilter: (props: any) => ({
      $or: [
        { userBaselineId: props.userSimulationId },
        { userFollowupIds: props.userSimulationId },
      ],
    }),
  })
)(UserName)
