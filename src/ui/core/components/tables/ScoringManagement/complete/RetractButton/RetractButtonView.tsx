import {
  AssessmentStatus,
  SimulationType,
  UserSimulationStatus,
} from 'src/utils/status'
import { Box, Button } from '@mui/material'

import Assessment from 'src/models/assessment'
import Swal from 'sweetalert2'
import UserSimulation from 'src/models/userSimulation'
import _ from 'lodash'
import axios from 'axios'
import { observer } from 'mobx-react'
import { useSnackbar } from 'notistack'

function RetractButtonView({
  userSimulation,
  mutate,
}: {
  userSimulation: UserSimulation
  mutate: any
}) {
  const { enqueueSnackbar } = useSnackbar()

  const onClickRetract = async () => {
    try {
      Swal.fire({
        title: 'Retracting..',
        html: 'Do not close this window.',
        timerProgressBar: true,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading()
        },
        allowOutsideClick: false,
      })
      await axios.post(
        `v3/scoringManagement/userSimulations/${userSimulation._id}/retract`
      )
      if (userSimulation.simulationType === SimulationType.Baseline) {
        await axios.patch(`/v1/userAssessmentCycles/renewSummary`, {
          filter: {
            userBaselineId: userSimulation._id,
          },
        })
      } else {
        await axios.patch(`/v1/userAssessmentCycles/renewSummary`, {
          filter: {
            userFollowupIds: userSimulation._id,
          },
        })
      }
      mutate && (await mutate())
      // enqueueSnackbar('Retracted', { variant: 'success' })
      Swal.fire({
        html: 'Retracted.',
        showConfirmButton: false,
      })
    } catch (e) {
      // enqueueSnackbar('Error', { variant: 'error' })
      Swal.fire({
        html: 'Failed. Please try later.',
        showConfirmButton: false,
      })
      console.log(e)
    }
  }
  const isPublished = userSimulation.status === UserSimulationStatus.Published
  const isDistributed =
    userSimulation.status === UserSimulationStatus.Distributed
  const isReviewed = userSimulation.status === UserSimulationStatus.Reviewed
  const isExported = userSimulation.status === UserSimulationStatus.Exported
  return (
    <Button
      disabled={!(isPublished || isDistributed || isReviewed || isExported)}
      onClick={onClickRetract}
      variant="contained"
    >
      Retract
    </Button>
  )
}

export default observer(RetractButtonView)
