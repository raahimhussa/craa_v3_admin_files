import {
  AdminLogScreen,
  ScorerStatus,
  SimulationType,
  UserSimulationStatus,
} from 'src/utils/status'
import { Box, Button } from '@mui/material'

import { AdminLogManager } from 'src/classes/adminLogManager'
import Assessment from 'src/models/assessment'
import Swal from 'sweetalert2'
import UserSimulation from 'src/models/userSimulation'
import _ from 'lodash'
import axios from 'axios'
import { observer } from 'mobx-react'
import { useSnackbar } from 'notistack'

function PublishButtonView({
  assessment,
  userSimulation,
  mutate,
}: {
  assessment: Assessment
  userSimulation: UserSimulation
  mutate: any
}) {
  const { enqueueSnackbar } = useSnackbar()

  const isScoringCompleted =
    assessment.firstScorer.status === ScorerStatus.Complete ||
    assessment.secondScorer.status === ScorerStatus.Complete

  const isAdjudicationCompleted =
    assessment.adjudicator.status === ScorerStatus.Complete

  const onClickPublish = async () => {
    Swal.fire({
      title: 'Publishing..',
      html: 'Do not close this window.',
      timerProgressBar: true,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading()
      },
      allowOutsideClick: false,
    })
    const adminLogManager = AdminLogManager.getInstance()
    try {
      if (userSimulation) {
        await axios.patch(
          `/v3/scoringManagement/userSimulations/${userSimulation._id}/publish`
        )
      }
      await adminLogManager?.createPublishSimulationLog({
        screen: AdminLogScreen.ScoringManagement,
        target: {
          type: 'userSimulations',
          _id: userSimulation._id,
        },
        message: `${
          (userSimulation as any)?.simulation?.name || ''
        } has been published.`,
      })
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
      // enqueueSnackbar('Published', { variant: 'success' })
      Swal.fire({
        html: 'Published.',
        showConfirmButton: false,
      })
    } catch {
      // enqueueSnackbar('Failed', { variant: 'error' })
      Swal.fire({
        html: 'Failed. Please try later.',
        showConfirmButton: false,
      })
    }
  }

  const isPublished = userSimulation.status === UserSimulationStatus.Published
  const isDistributed =
    userSimulation.status === UserSimulationStatus.Distributed
  return (
    <Button
      disabled={!isScoringCompleted || !isAdjudicationCompleted}
      onClick={onClickPublish}
      variant="contained"
    >
      {isPublished || isDistributed ? 'Published' : 'Publish'}
    </Button>
  )
}

export default observer(PublishButtonView)
