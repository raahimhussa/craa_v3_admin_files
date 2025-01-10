import '@toast-ui/editor/dist/toastui-editor.css'

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Typography,
} from '@mui/material'
import {
  AdminLogScreen,
  TrainingStatus,
  UserSimulationStatus,
} from 'src/utils/status'

import { AdminLogManager } from 'src/classes/adminLogManager'
import { AssessmentCycle } from 'src/models/assessmentCycle'
import AssessmentType from 'src/models/assessmentType'
import ClientUnit from 'src/models/clientUnit'
import { ExpandMore } from '@mui/icons-material'
import UserAssessmentCycle from 'src/models/userAssessmentCycle'
import UserSimulation from 'src/models/userSimulation'
import UserTraining from 'src/models/userTraining'
import axios from 'axios'
import { observer } from 'mobx-react'
import { useSnackbar } from 'notistack'
import { useState } from 'react'

type Props = {
  assessmentType: AssessmentType
  assessmentTypes: AssessmentType[]
  userAssessmentCycle: UserAssessmentCycle
  userAssessmentCyclesMutate: any
  userBaseline: UserSimulation
  userFollowups: UserSimulation[]
  userTrainings: UserTraining[]
  userSimulationsMutate: any
  userTrainingsMutate: any
}

const getFormattedTime = (seconds: number) => {
  const hours = Math.floor(seconds / (60 * 60))
  const mins = Math.floor((seconds - hours * 60 * 60) / 60)
  const secs = seconds - hours * 60 * 60 - mins * 60
  return `${hours.toString().padStart(2, '0')}:${mins
    .toString()
    .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function SelectAssessmentTypesView(props: Props) {
  const {
    assessmentType,
    assessmentTypes,
    userAssessmentCycle,
    userAssessmentCyclesMutate,
    userBaseline,
    userFollowups,
    userTrainings,
    userSimulationsMutate,
    userTrainingsMutate,
  } = props
  const { enqueueSnackbar } = useSnackbar()

  const onClickUserSimulationUpdate = async (
    e: any,
    userSimulation?: UserSimulation
  ) => {
    if (!userSimulation?._id) return
    try {
      const adminLogManager = AdminLogManager.getInstance()
      await axios.patch('/v2/userSimulations', {
        filter: {
          _id: userSimulation._id,
        },
        update: {
          $set: {
            status: e.target.checked
              ? UserSimulationStatus.Assigned
              : UserSimulationStatus.HasNotAssigned,
          },
        },
      })
      e.target.check
        ? await adminLogManager?.createAssignSimulationLog({
            screen: AdminLogScreen.UserManagement,
            target: {
              type: 'userSimulations',
              _id: userSimulation._id,
            },
            message: `${
              (userSimulation as any)?.simulation?.name || ''
            } has been assigned.`,
          })
        : await adminLogManager?.createRemoveSimulationLog({
            screen: AdminLogScreen.UserManagement,
            target: {
              type: 'userSimulations',
              _id: userSimulation._id,
            },
            message: `${
              (userSimulation as any)?.simulation?.name || ''
            } has been removed.`,
          })
      await axios.patch('/v1/userAssessmentCycles/renewSummary', {
        filter: {
          $or: [
            { userBaselineId: userSimulation._id },
            { userFollowupIds: userSimulation._id },
          ],
        },
      })
      enqueueSnackbar('successfully updated', { variant: 'success' })
    } catch (e) {
      console.error(e)
      enqueueSnackbar('update failed', { variant: 'error' })
    }

    userSimulationsMutate && (await userSimulationsMutate())
  }

  const onClickUserTrainingUpdate = async (e: any, userTrainingId: string) => {
    if (!userTrainingId) return
    try {
      await axios.patch('/v2/userTrainings', {
        filter: {
          _id: userTrainingId,
        },
        update: {
          $set: {
            status: e.target.checked
              ? TrainingStatus.HasNotStarted
              : TrainingStatus.HasNotAssigned,
          },
        },
      })
      await axios.patch('/v1/userAssessmentCycles/renewSummary', {
        filter: {
          userTrainingIds: userTrainingId,
        },
      })
      enqueueSnackbar('successfully updated', { variant: 'success' })
    } catch (e) {
      console.error(e)
      enqueueSnackbar('update failed', { variant: 'error' })
    }

    userTrainingsMutate && (await userTrainingsMutate())
  }

  return (
    <Box sx={{ ml: 2 }}>
      {assessmentTypes.map((_assessmentType) => {
        if (assessmentType._id !== _assessmentType._id) {
          return null
        }
        return (
          <Box sx={{ ml: 2 }}>
            <Box>
              <Box sx={{ fontSize: '16px', fontWeight: '500', mt: 1 }}>
                Baseline
                <Divider sx={{ my: 0.5 }} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  checked={
                    userBaseline.status !==
                      UserSimulationStatus.HasNotAssigned &&
                    assessmentType._id === _assessmentType._id
                  }
                  onChange={(e) => onClickUserSimulationUpdate(e, userBaseline)}
                />
                <Typography sx={{ width: '296px', mr: 2, fontSize: '15px' }}>
                  {_assessmentType.baseline?.label}
                </Typography>
                <Box
                  sx={{
                    // backgroundColor: '#bbbbbb',
                    p: '4px',
                    // borderRadius: 1,
                  }}
                >
                  <Chip
                    sx={{ bgcolor: '#edf4f7', height: '30px' }}
                    label={getFormattedTime(userBaseline.testTime)}
                  />
                </Box>
              </Box>
            </Box>
            <Box>
              <Box sx={{ fontSize: '16px', fontWeight: '500', mt: 1 }}>
                Trainings
                <Divider sx={{ my: 0.5 }} />
              </Box>
              <Box>
                {_assessmentType.trainings.map((_training: any) => {
                  const userTraining = userTrainings.find((_userTraining) => {
                    return _userTraining.domainId === _training.domain._id
                  })
                  return (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Checkbox
                        checked={
                          userTraining?.status !==
                            TrainingStatus.HasNotAssigned &&
                          assessmentType._id === _assessmentType._id
                        }
                        onChange={(e) =>
                          onClickUserTrainingUpdate(e, userTraining?._id || '')
                        }
                        sx={{
                          py: 0.5,
                        }}
                      />
                      <Typography
                        sx={{
                          width: '296px',
                          mr: 2,
                          fontSize: '14.5px',
                          mt: 0.6,
                        }}
                      >
                        {_training.training?.title}
                      </Typography>
                    </Box>
                  )
                })}
              </Box>
            </Box>
            <Box>
              <Box sx={{ fontSize: '16px', fontWeight: '500', mt: 1 }}>
                Followups
                <Divider sx={{ my: 0.5 }} />
              </Box>
              <Box>
                {_assessmentType.followups.map((_followup) => {
                  const userFollowup = userFollowups.find(
                    (_userFollowup) =>
                      _userFollowup.domainId === _followup.domain._id
                  )
                  return (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Checkbox
                        checked={
                          userFollowup?.status !==
                            UserSimulationStatus.HasNotAssigned &&
                          assessmentType._id === _assessmentType._id
                        }
                        onChange={(e) =>
                          onClickUserSimulationUpdate(e, userFollowup)
                        }
                        sx={{
                          py: 0.5,
                        }}
                      />
                      <Typography
                        sx={{
                          width: '296px',
                          mr: 2,
                          fontSize: '14.5px',
                          mt: 0.6,
                        }}
                      >
                        {/* @ts-ignore */}
                        {_followup?.name || _followup?.label}
                      </Typography>
                      <Box
                        sx={
                          {
                            // p: '4px',
                          }
                        }
                      >
                        <Chip
                          sx={{ bgcolor: '#edf4f7', height: '26px' }}
                          label={getFormattedTime(userFollowup?.testTime || 0)}
                        />
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}
export default observer(SelectAssessmentTypesView)
