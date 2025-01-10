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
    try {
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
      mutate && mutate()
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
  return (
    <Button
      disabled={!(isPublished || isDistributed)}
      onClick={onClickRetract}
      variant="contained"
    >
      Retract
    </Button>
  )
}

export default observer(RetractButtonView)
