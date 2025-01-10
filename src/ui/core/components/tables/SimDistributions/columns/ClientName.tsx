import * as React from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import UserAssessmentCycle from 'src/models/userAssessmentCycle'
import UserSimulation from 'src/models/userSimulation'
import { UserSimulationStatus } from 'src/utils/status'
import axios from 'axios'
import compose from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useSnackbar } from 'notistack'
import { withFind } from '@hocs'
import withFindOne from 'src/hocs/withFindOne'

type Props = {
  userAssessmentCycles: (UserAssessmentCycle & any)[]
}

const ClientName = observer(({ userAssessmentCycles }: Props) => {
  const userAssessmentCycle = userAssessmentCycles?.[0]
  if (!userAssessmentCycle) return null
  return <div>{userAssessmentCycle.clientUnit.name}</div>
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
)(ClientName)
