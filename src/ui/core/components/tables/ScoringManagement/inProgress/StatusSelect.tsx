import {
  AssessmentStatus,
  ScorerStatus,
  SimulationType,
  UserSimulationStatus,
} from 'src/utils/status'
import { observer, useLocalObservable } from 'mobx-react'

import Assessment from 'src/models/assessment'
import { AssessmentScorerType } from 'src/stores/ui/pages/assessment'
import { CellProps } from 'react-table'
import { IAssessment } from 'src/models/assessment/assessment.interface'
import Select from 'src/ui/core/components/mui/inputs/Select/Select'
import UserSimulation from 'src/models/userSimulation'
import axios from 'axios'
import { reaction } from 'mobx'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'

const StatusSelectView = (
  props: CellProps<Assessment & { userSimulation: UserSimulation }> & {
    type: AssessmentScorerType
    mutate: any
    userSimulation: UserSimulation
  }
) => {
  const { assessmentStore } = useRootStore()
  const { enqueueSnackbar } = useSnackbar()
  const isPublished =
    props.row.original?.userSimulation.status === UserSimulationStatus.Published
  const isDistributed =
    props.row.original?.userSimulation.status ===
    UserSimulationStatus.Distributed
  let scorer: any = props.row.original.firstScorer
  if (props.type === AssessmentScorerType.FirstScorer) {
    scorer = props.row.original.firstScorer
  } else if (props.type === AssessmentScorerType.SecondScorer) {
    scorer = props.row.original.secondScorer
  } else if (props.type === AssessmentScorerType.Adjudicator) {
    scorer = props.row.original.adjudicator
  }

  const statusOptions = [
    {
      text: 'InProgress',
      value: AssessmentStatus.InProgress,
    },
    {
      text: 'Pending',
      value: AssessmentStatus.Pending,
    },
    {
      text: 'Complete',
      value: AssessmentStatus.Complete,
    },
  ]

  const state = useLocalObservable(() => ({
    scorer: scorer,
  }))
  //FIXME - isPublished must be with userSimulation

  reaction(
    () => state.scorer.status,
    async (newStatus) => {
      try {
        const assessment = props.row.original
        if (props.type === AssessmentScorerType.Adjudicator) {
          if (
            assessment.firstScorer.status === ScorerStatus.Complete &&
            assessment.secondScorer.status === ScorerStatus.Complete
          ) {
            await assessmentStore.changeStatus(
              assessment._id,
              props.type,
              newStatus
            )
            if (
              props.userSimulation.simulationType === SimulationType.Baseline
            ) {
              await axios.patch(`/v1/userAssessmentCycles/renewSummary`, {
                filter: {
                  userBaselineId: props.userSimulation._id,
                },
              })
            } else {
              await axios.patch(`/v1/userAssessmentCycles/renewSummary`, {
                filter: {
                  userFollowupIds: props.userSimulation._id,
                },
              })
            }
            props.mutate && props.mutate()
            enqueueSnackbar('Status Changed', { variant: 'success' })
          }
        } else {
          if (assessment.adjudicator.status !== ScorerStatus.Complete) {
            await assessmentStore.changeStatus(
              assessment._id,
              props.type,
              newStatus
            )
            if (
              props.userSimulation.simulationType === SimulationType.Baseline
            ) {
              await axios.patch(`/v1/userAssessmentCycles/renewSummary`, {
                filter: {
                  userBaselineId: props.userSimulation._id,
                },
              })
            } else {
              await axios.patch(`/v1/userAssessmentCycles/renewSummary`, {
                filter: {
                  userFollowupIds: props.userSimulation._id,
                },
              })
            }
            props.mutate && props.mutate()
            enqueueSnackbar('Status Changed', { variant: 'success' })
          }
        }
      } catch (error) {
        enqueueSnackbar('Status Changed Failed', { variant: 'error' })
        return console.log(error)
      }
    }
  )

  const getDisabled = (newStatus: ScorerStatus) => {
    const assessment = props.row.original
    if (props.type === AssessmentScorerType.Adjudicator) {
      if (
        assessment.firstScorer.status === ScorerStatus.Complete &&
        assessment.secondScorer.status === ScorerStatus.Complete
      ) {
        return false
      }
    } else {
      if (assessment.adjudicator.status !== ScorerStatus.Complete) {
        return false
      }
    }
    return true
  }

  return (
    <Select
      disabled={
        getDisabled(state.scorer.status) || isPublished || isDistributed
      }
      sx={{ width: '165px', height: '30px' }}
      options={statusOptions}
      state={state}
      path="scorer.status"
    />
  )
}

export default observer(StatusSelectView)
