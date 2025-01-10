import '@toast-ui/editor/dist/toastui-editor.css'

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Table,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material'

import { AssessmentCycle } from 'src/models/assessmentCycle'
import AssessmentType from 'src/models/assessmentType'
import ClientUnit from 'src/models/clientUnit'
import DeleteDialogue from '@components/DeleteDialogue/DeleteDialogue'
import { CancelRounded, Delete, ExpandMore } from '@mui/icons-material'
import SelectAssessmentTypes from './SelectAssessmentTypes/SelectAssessmentTypes'
import UserAssessmentCycle from 'src/models/userAssessmentCycle'
import UserSimulation from 'src/models/userSimulation'
import UserTraining from 'src/models/userTraining'
import axios from 'axios'
import { observer } from 'mobx-react'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import palette from 'src/theme/palette'

type Props = {
  clientUnits: ClientUnit[]
  userAssessmentCycles: UserAssessmentCycle[]
  userAssessmentCyclesMutate: any
  userSimulations: UserSimulation[]
  userTrainings: UserTraining[]
  userSimulationsMutate: any
  userTrainingsMutate: any
}

function SelectSimulationsView(props: Props) {
  const {
    clientUnits,
    userAssessmentCycles,
    userAssessmentCyclesMutate,
    userSimulations,
    userTrainings,
    userSimulationsMutate,
    userTrainingsMutate,
  } = props
  const [openDeleteDialogue, setOpenDeleteDialogue] = useState<boolean>(false)
  const { enqueueSnackbar } = useSnackbar()

  const onClickOpenDeleteDialogue = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setOpenDeleteDialogue(true)
  }

  const onClickCloseDeleteDialogue = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setOpenDeleteDialogue(false)
  }

  const onClickRemove = async (userAssessmentCycleId: string) => {
    try {
      await axios.delete(
        `v1/userAssessmentCycles/${userAssessmentCycleId}/cascade`
      )
      const currentUserAssessmentCycle = userAssessmentCycles.find(
        (_uac) => _uac._id === userAssessmentCycleId
      )
      if (currentUserAssessmentCycle) {
        const userSimulationIds = [
          currentUserAssessmentCycle.userBaselineId,
          ...currentUserAssessmentCycle.userFollowupIds,
        ]
        await axios.delete('v2/assessments', {
          params: {
            filter: {
              userSimulationId: { $in: userSimulationIds },
            },
          },
        })
      }
      userSimulationsMutate && (await userSimulationsMutate())
    } catch (error) {
      console.error({ error })
      throw error
    }
  }

  const onClickBypassToggle = async (
    e: any,
    userAssessmentCycle: UserAssessmentCycle
  ) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await axios.patch('/v1/userAssessmentCycles', {
        filter: {
          _id: userAssessmentCycle._id,
        },
        update: {
          $set: {
            bypass: e.target.checked,
          },
        },
      })
      enqueueSnackbar('successfully updated', { variant: 'success' })
    } catch (e) {
      console.error(e)
      enqueueSnackbar('update failed', { variant: 'error' })
    }

    userAssessmentCyclesMutate && (await userAssessmentCyclesMutate())
  }

  return (
    <Box>
      {userAssessmentCycles.map((_userAssessmentCycle) => {
        const localUserAssessmentCycle =
          _userAssessmentCycle as UserAssessmentCycle & {
            assessmentCycle: AssessmentCycle
            assessmentType: AssessmentType
            userBaseline: UserSimulation
            userFollowups: UserSimulation[]
          }
        const clientUnit = clientUnits.find(
          (_clientUnit) =>
            _clientUnit._id === localUserAssessmentCycle.clientUnitId
        )
        const businessUnit = clientUnit?.businessUnits.find(
          (_businessUnit) =>
            _businessUnit._id === localUserAssessmentCycle.businessUnitId
        )
        const localAssessmentType = (_userAssessmentCycle as any)
          .assessmentType as AssessmentType
        const localUserBaseline = userSimulations.find(
          (_userSimulation) =>
            _userSimulation._id === _userAssessmentCycle.userBaselineId
        )
        const localUserFollowups = userSimulations.filter((_userSimulation) =>
          _userAssessmentCycle.userFollowupIds.includes(_userSimulation._id)
        )
        const localUserTrainings = userTrainings.filter((_userTraining) =>
          _userAssessmentCycle.userTrainingIds.includes(_userTraining._id)
        )

        if (
          !clientUnit ||
          !businessUnit ||
          !localUserBaseline ||
          !localUserFollowups ||
          !localUserTrainings
        ) {
          return null
        }
        // const businessCycle = businessUnit?.businessCycles.find(
        //   (_businessCycle) =>
        //     _businessCycle._id === localUserAssessmentCycle.businessCycleId
        // )
        return (
          <>
            <Divider sx={{ mb: 2 }} />
            <Accordion
              key={localUserAssessmentCycle._id}
              sx={{
                mt: 1,
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{
                  flexDirection: 'column',
                  boxShadow: '0 8px 16px 0 rgb(145 158 171 / 16%)',
                  borderRadius: '12px',
                  pb: 1,
                  '&.Mui-expanded': {
                    boxShadow: 'none',
                  },
                }}
                className="fullwidth"
              >
                <Box
                  sx={{
                    display: 'flex',
                    width: '480px',
                    justifyContent: 'space-between',
                    px: 1,
                    // alignItems: 'center',
                  }}
                >
                  <table>
                    <tr>
                      <td
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          paddingRight: '24px',
                        }}
                      >
                        <Chip label="Client" sx={{ height: '30px' }} />
                      </td>
                      <td>
                        <Box
                          sx={{
                            fontSize: '15px',
                          }}
                        >{`${clientUnit?.name} `}</Box>
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          paddingRight: '24px',
                          paddingTop: '0.2rem',
                        }}
                      >
                        <Chip label="Business Unit" sx={{ height: '30px' }} />
                      </td>
                      <td>
                        <Box
                          sx={{
                            fontSize: '15px',
                          }}
                        >{`${businessUnit?.name}`}</Box>
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          paddingRight: '24px',
                          paddingTop: '0.2rem',
                        }}
                      >
                        <Chip
                          label=" Assessment Cycle"
                          sx={{ height: '30px' }}
                        />
                      </td>
                      <td>
                        <Box
                          sx={{
                            fontSize: '15px',
                          }}
                        >{`${localUserAssessmentCycle.assessmentCycle.name}`}</Box>
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          paddingRight: '24px',
                          paddingTop: '0.2rem',
                        }}
                      >
                        <Chip label="Assessment Type" sx={{ height: '30px' }} />
                      </td>
                      <td>
                        <Box
                          sx={{
                            fontSize: '15px',
                          }}
                        >{`${localAssessmentType.label}`}</Box>
                      </td>
                    </tr>
                    <tr style={{}}>
                      <td
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          paddingTop: '0.2rem',
                          paddingRight: '24px',
                        }}
                      >
                        <Chip label="Bypass" sx={{ height: '30px' }} />
                      </td>
                      <td>
                        {/* <Box>{`${
                          localUserAssessmentCycle.bypass ? 'TRUE' : 'FALSE'
                        }`}</Box> */}
                        <Switch
                          checked={localUserAssessmentCycle.bypass}
                          onClick={(e) =>
                            onClickBypassToggle(e, localUserAssessmentCycle)
                          }
                        />
                      </td>
                      {/* <Box
                        sx={{
                          fontSize: '16px',
                          fontWeight: '500',
                          mt: 1,
                          ml: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          Bypass
                          <Switch
                            checked={localUserAssessmentCycle.bypass}
                            onClick={(e) =>
                              onClickBypassToggle(e, localUserAssessmentCycle)
                            }
                          />
                        </Box>
                        <Divider />
                      </Box> */}
                    </tr>
                  </table>
                  <Button
                    // variant="contained"
                    onClick={onClickOpenDeleteDialogue}
                    sx={{
                      minWidth: '10px',
                      position: 'absolute',
                      right: '-10px',
                      top: '-4px',
                    }}
                  >
                    {/* Remove */}
                    <CancelRounded sx={{ color: palette.light.button.red }} />
                  </Button>
                  <DeleteDialogue
                    open={openDeleteDialogue}
                    handleClose={onClickCloseDeleteDialogue}
                    onDelete={() => onClickRemove(_userAssessmentCycle._id)}
                    title={`Are you sure you want to delete "${clientUnit?.name} / ${businessUnit?.name} / ${localUserAssessmentCycle.assessmentCycle.name}"? `}
                    text={
                      "This item will be deleted permanently. You can't undo this action."
                    }
                    yesText={'Remove'}
                    noText={'Cancel'}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <SelectAssessmentTypes
                  assessmentType={localAssessmentType}
                  assessmentTypeIds={
                    localUserAssessmentCycle.assessmentCycle.assessmentTypeIds
                  }
                  userAssessmentCycle={localUserAssessmentCycle}
                  userAssessmentCyclesMutate={userAssessmentCyclesMutate}
                  userBaseline={localUserBaseline}
                  userFollowups={localUserFollowups}
                  userTrainings={localUserTrainings}
                  userSimulationsMutate={userSimulationsMutate}
                  userTrainingsMutate={userTrainingsMutate}
                />
              </AccordionDetails>
            </Accordion>
          </>
        )
      })}
    </Box>
  )
}
export default observer(SelectSimulationsView)
