import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Close, ExitToApp } from '@mui/icons-material'

import Loading from '@components/Loading/Loading'
import axios from 'axios'
import { observer } from 'mobx-react'
import { useState } from 'react'

function MigrationView({ info, infoMutate, demoVersion }: any) {
  const [isMigrating, setIsMigrating] = useState<boolean>(false)
  const [openVersionControl, setOpenVersionControl] = useState<boolean>(false)
  const [version, setVersion] = useState<string>(demoVersion + '')

  const isSimulationsMigrationDisabled = () => {
    const isMigrated = info.simulation
    return isMigrated || isMigrating
  }
  const isFindingsMigrationDisabled = () => {
    const isMigrated = info.finding
    return isMigrated || isMigrating || !info.keyConcept
  }
  const isFindingGroupsMigrationDisabled = () => {
    const isMigrated = info.findingGroup
    return (
      isMigrated ||
      isMigrating ||
      !info.clientUnit ||
      !info.finding ||
      !info.simulationMapper ||
      !info.assessmentType ||
      !info.assessmentCycle
    )
  }
  const isSimulationMappersMigrationDisabled = () => {
    const isMigrated = info.simulationMapper
    return isMigrated || isMigrating || !info.simulation || !info.finding
  }
  const isTrainingsMigrationDisabled = () => {
    const isMigrated = info.training
    return isMigrated || isMigrating
  }
  const isAssessmentTypesMigrationDisabled = () => {
    const isMigrated = info.assessmentType
    return isMigrated || isMigrating || !info.simulation || !info.training
  }
  const isAssessmentCyclesMigrationDisabled = () => {
    const isMigrated = info.assessmentCycle
    return isMigrated || isMigrating || !info.simulation || !info.training
  }
  const isClientsMigrationDisabled = () => {
    const isMigrated = info.clientUnit
    return (
      isMigrated || isMigrating || !info.assessmentType || !info.assessmentCycle
    )
  }
  const isKeyConceptDisabled = () => {
    const isMigrated = info.keyConcept
    return isMigrated || isMigrating
  }
  const isUsersMigrationDisabled = () => {
    const isMigrated = info.user
    return isMigrated || isMigrating || !info.clientUnit
  }
  const isUserSimulationsMigrationDisabled = () => {
    const isMigrated = info.userSimulation
    return isMigrated || isMigrating || !info.user || !info.findingGroup
  }
  const isAssessmentsMigrationDisabled = () => {
    const isMigrated = info.assessment
    return isMigrated || isMigrating || !info.userSimulation
  }
  const isUserTrainingsMigrationDisabled = () => {
    const isMigrated = info.userTraining
    return isMigrated || isMigrating || !info.user || !info.training
  }
  const isUserAssessmentCyclesMigrationDisabled = () => {
    const isMigrated = info.userAssessmentCycle
    return (
      isMigrated ||
      isMigrating ||
      !info.user ||
      !info.userTraining ||
      !info.userSimulation
    )
  }
  const isUserAssessmentCycleSummariesMigrationDisabled = () => {
    const isMigrated = info.userAssessmentCycleSummary
    return (
      isMigrated ||
      isMigrating ||
      !info.user ||
      !info.userTraining ||
      !info.userSimulation ||
      !info.userAssessmentCycle
    )
  }
  const isSimDocsMigrationDisabled = () => {
    const isMigrated = info.simDoc
    return isMigrated || isMigrating || !info.folder
  }
  const isFoldersMigrationDisabled = () => {
    const isMigrated = info.folder
    return isMigrated || isMigrating || !info.simulation
  }

  const isNotesMigrationDisabled = () => {
    const isMigrated = info.note
    return isMigrated || isMigrating || !info.userSimulation || !info.simDoc
  }

  const isAnswerMigrationDisabled = () => {
    const isMigrated = info.answer
    return isMigrated || isMigrating || !info.note
  }

  const simulationsMigration = async () => {
    setIsMigrating(true)
    await axios.get('v3/migrations/simulations' + `?version=${version}`)
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }
  const findingsMigration = async () => {
    setIsMigrating(true)
    await axios.get('v3/migrations/findings' + `?version=${version}`)
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }
  const findingGroupsMigration = async () => {
    setIsMigrating(true)
    await axios.get('v3/migrations/findingGroups' + `?version=${version}`)
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }
  const simulationMappersMigration = async () => {
    setIsMigrating(true)
    await axios.get('v3/migrations/simulationMappers' + `?version=${version}`)
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }
  const trainingsMigration = async () => {
    setIsMigrating(true)
    await axios.get('v3/migrations/trainings' + `?version=${version}`)
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }
  const assessmentCyclesMigration = async () => {
    setIsMigrating(true)
    await axios.get('v3/migrations/assessmentCycles' + `?version=${version}`)
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }
  const assessmentTypesMigration = async () => {
    setIsMigrating(true)
    await axios.get('v3/migrations/assessmentCycles' + `?version=${version}`)
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }
  const clientUnitsMigration = async () => {
    setIsMigrating(true)
    await axios.get('v3/migrations/clientUnits' + `?version=${version}`)
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }
  const usersMigration = async () => {
    setIsMigrating(true)
    await axios.get('v3/migrations/users' + `?version=${version}`)
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }
  const assessmentsMigration = async () => {
    setIsMigrating(true)
    await axios.get('v3/migrations/assessments' + `?version=${version}`)
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }
  const userSimulationsMigration = async () => {
    setIsMigrating(true)
    await axios.get('v3/migrations/userSimulations' + `?version=${version}`)
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }
  const userTrainingsMigration = async () => {
    setIsMigrating(true)
    await axios.get('v3/migrations/userTrainings' + `?version=${version}`)
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }
  const userAssessmentCyclesMigration = async () => {
    setIsMigrating(true)
    await axios.get(
      'v3/migrations/userAssessmentCycles' + `?version=${version}`
    )
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }

  const userAssessmentCycleSummariesMigration = async () => {
    setIsMigrating(true)
    await axios.get(
      'v3/migrations/userAssessmentCycleSummaries' + `?version=${version}`
    )
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }

  const keyConceptsMigration = async () => {
    setIsMigrating(true)
    await axios.get('v3/migrations/keyConcepts' + `?version=${version}`)
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }

  const simDocsMigration = async () => {
    setIsMigrating(true)
    await axios.get('v3/migrations/simDocs' + `?version=${version}`)
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }

  const foldersMigration = async () => {
    setIsMigrating(true)
    await axios.get('v3/migrations/folders' + `?version=${version}`)
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }

  const notesMigration = async () => {
    setIsMigrating(true)
    await axios.get('v3/migrations/notes' + `?version=${version}`)
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }

  const answersMigration = async () => {
    setIsMigrating(true)
    await axios.get('v3/migrations/answers' + `?version=${version}`)
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }

  // delete
  const deleteSimulationsMigration = async () => {
    setIsMigrating(true)
    await axios.delete('v3/migrations/simulations')
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }
  const deleteFindingsMigration = async () => {
    setIsMigrating(true)
    await axios.delete('v3/migrations/findings')
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }
  const deleteFindingGroupsMigration = async () => {
    setIsMigrating(true)
    await axios.delete('v3/migrations/findingGroups')
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }
  const deleteSimulationMappersMigration = async () => {
    setIsMigrating(true)
    await axios.delete('v3/migrations/simulationMappers')
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }
  const deleteTrainingsMigration = async () => {
    setIsMigrating(true)
    await axios.delete('v3/migrations/trainings')
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }
  const deleteAssessmentCyclesMigration = async () => {
    setIsMigrating(true)
    await axios.delete('v3/migrations/assessmentCycles')
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }
  const deleteAssessmentTypesMigration = async () => {
    setIsMigrating(true)
    await axios.delete('v3/migrations/assessmentTypes')
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }
  const deleteClientUnitsMigration = async () => {
    setIsMigrating(true)
    await axios.delete('v3/migrations/clientUnits')
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }
  const deleteUsersMigration = async () => {
    setIsMigrating(true)
    await axios.delete('v3/migrations/users')
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }
  const deleteUserSimulationsMigration = async () => {
    setIsMigrating(true)
    await axios.delete('v3/migrations/userSimulations')
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }
  const deleteAssessmentsMigration = async () => {
    setIsMigrating(true)
    await axios.delete('v3/migrations/assessments')
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }
  const deleteUserTrainingsMigration = async () => {
    setIsMigrating(true)
    await axios.delete('v3/migrations/userTrainings')
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }
  const deleteUserAssessmentCyclesMigration = async () => {
    setIsMigrating(true)
    await axios.delete('v3/migrations/userAssessmentCycles')
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }

  const deleteUserAssessmentCycleSummariesMigration = async () => {
    setIsMigrating(true)
    await axios.delete('v3/migrations/userAssessmentCycleSummaries')
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }

  const deleteKeyConceptsMigration = async () => {
    setIsMigrating(true)
    await axios.delete('v3/migrations/keyConcepts')
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }

  const deleteSimDocsMigration = async () => {
    setIsMigrating(true)
    await axios.delete('v3/migrations/simDocs')
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }

  const deleteFoldersMigration = async () => {
    setIsMigrating(true)
    await axios.delete('v3/migrations/folders')
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }

  const deleteNotesMigration = async () => {
    setIsMigrating(true)
    await axios.delete('v3/migrations/notes')
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }

  const deleteAnswersMigration = async () => {
    setIsMigrating(true)
    await axios.delete('v3/migrations/answers')
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }

  const deleteAll = async () => {
    setIsMigrating(true)
    await axios.delete('v3/migrations/all')
    setIsMigrating(false)
    infoMutate && (await infoMutate())
  }

  const handleChangeDemoVersion = async (version: string) => {
    await axios.patch('v1/systemSettings/demoVersion', { version })
    setVersion(version)
    handleCloseVersionControl()
    await deleteAll()
  }
  const handleOpenVersionControl = () => setOpenVersionControl(true)
  const handleCloseVersionControl = () => setOpenVersionControl(false)
  const getCurrentDemoVersion = () => {
    if (version === '1') return 'Demo 1'
    if (version === '2') return 'Demo 2'
    return 'undefined'
  }

  return (
    <Box sx={{ maxHeight: 'calc(100vh - 180px)', overflow: 'auto' }}>
      <div style={{ display: 'flex', marginTop: 12, marginBottom: 12 }}>
        <Button variant="contained" onClick={handleOpenVersionControl}>
          Change Demo Version
        </Button>
        <Box sx={{ ml: 2 }}>
          <Typography>Current Version: {getCurrentDemoVersion()}</Typography>
        </Box>
        <Modal
          open={openVersionControl}
          onClose={handleCloseVersionControl}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: 'absolute' as 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 480,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              borderRadius: 1,
              boxShadow: 24,
              pl: 4,
              pr: 4,
              pb: 4,
            }}
          >
            <Box sx={{ height: 48 }}>
              <Button
                onClick={handleCloseVersionControl}
                sx={{ position: 'absolute', right: 4, top: 12 }}
              >
                <Close />
              </Button>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography>
                If you change demo database version, current demo data will be
                deleted permanently.
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              disabled={version === '1'}
              onClick={() => handleChangeDemoVersion('1')}
            >
              Demo 1
            </Button>
            <Box sx={{ height: 12 }} />
            <Button
              variant="contained"
              fullWidth
              disabled={version === '2'}
              onClick={() => handleChangeDemoVersion('2')}
            >
              Demo 2
            </Button>
          </Box>
        </Modal>
      </div>
      {isMigrating ? (
        <Box>
          <Loading />
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow sx={{ height: 32 }}>
              <TableCell
                sx={{
                  width: 378,
                }}
              >
                <Box
                  sx={{
                    width: 378,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  Data Table
                </Box>
              </TableCell>
              <TableCell
                sx={{
                  width: 256,
                }}
              >
                <Box
                  sx={{
                    width: 256,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  Delete
                </Box>
              </TableCell>
              <TableCell
                sx={{
                  width: 256,
                }}
              >
                <Box
                  sx={{
                    width: 256,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  Completed
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow sx={{ height: 48 }}>
              <TableCell sx={{ width: 378 }}>
                <Button
                  sx={{ width: 378 }}
                  variant="contained"
                  disabled={isSimulationsMigrationDisabled()}
                  onClick={simulationsMigration}
                >
                  Simulations Migration
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Button
                  sx={{
                    width: 256,
                  }}
                  variant="contained"
                  onClick={deleteSimulationsMigration}
                >
                  Delete
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Box
                  sx={{
                    width: 256,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {info.simulation ? 'TRUE' : 'FALSE'}
                </Box>
              </TableCell>
            </TableRow>
            <TableRow sx={{ height: 48 }}>
              <TableCell sx={{ width: 378 }}>
                <Button
                  sx={{ width: 378 }}
                  variant="contained"
                  disabled={isFoldersMigrationDisabled()}
                  onClick={foldersMigration}
                >
                  Folders Migration
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Button
                  sx={{
                    width: 256,
                  }}
                  variant="contained"
                  onClick={deleteFoldersMigration}
                >
                  Delete
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Box
                  sx={{
                    width: 256,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {info.folder ? 'TRUE' : 'FALSE'}
                </Box>
              </TableCell>
            </TableRow>
            <TableRow sx={{ height: 48 }}>
              <TableCell sx={{ width: 378 }}>
                <Button
                  sx={{ width: 378 }}
                  variant="contained"
                  disabled={isSimDocsMigrationDisabled()}
                  onClick={simDocsMigration}
                >
                  SimDocs Migration
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Button
                  sx={{
                    width: 256,
                  }}
                  variant="contained"
                  onClick={deleteSimDocsMigration}
                >
                  Delete
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Box
                  sx={{
                    width: 256,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {info.simDoc ? 'TRUE' : 'FALSE'}
                </Box>
              </TableCell>
            </TableRow>
            <TableRow sx={{ height: 48 }}>
              <TableCell sx={{ width: 378 }}>
                <Button
                  sx={{ width: 378 }}
                  variant="contained"
                  disabled={isFindingsMigrationDisabled()}
                  onClick={findingsMigration}
                >
                  Findings Migration
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Button
                  sx={{
                    width: 256,
                  }}
                  variant="contained"
                  onClick={deleteFindingsMigration}
                >
                  Delete
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Box
                  sx={{
                    width: 256,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {info.finding ? 'TRUE' : 'FALSE'}
                </Box>
              </TableCell>
            </TableRow>
            <TableRow sx={{ height: 48 }}>
              <TableCell sx={{ width: 378 }}>
                <Button
                  sx={{ width: 378 }}
                  variant="contained"
                  disabled={isKeyConceptDisabled()}
                  onClick={keyConceptsMigration}
                >
                  KeyConcepts Migration
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Button
                  sx={{
                    width: 256,
                  }}
                  variant="contained"
                  onClick={deleteKeyConceptsMigration}
                >
                  Delete
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Box
                  sx={{
                    width: 256,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {info.keyConcept ? 'TRUE' : 'FALSE'}
                </Box>
              </TableCell>
            </TableRow>
            <TableRow sx={{ height: 48 }}>
              <TableCell sx={{ width: 378 }}>
                <Button
                  sx={{ width: 378 }}
                  variant="contained"
                  disabled={isSimulationMappersMigrationDisabled()}
                  onClick={simulationMappersMigration}
                >
                  SimulationMappers Migration
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Button
                  sx={{
                    width: 256,
                  }}
                  variant="contained"
                  onClick={deleteSimulationMappersMigration}
                >
                  Delete
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Box
                  sx={{
                    width: 256,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {info.simulationMapper ? 'TRUE' : 'FALSE'}
                </Box>
              </TableCell>
            </TableRow>
            <TableRow sx={{ height: 48 }}>
              <TableCell sx={{ width: 378 }}>
                <Button
                  sx={{ width: 378 }}
                  variant="contained"
                  disabled={isTrainingsMigrationDisabled()}
                  onClick={trainingsMigration}
                >
                  Trainings Migration
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Button
                  sx={{
                    width: 256,
                  }}
                  variant="contained"
                  onClick={deleteTrainingsMigration}
                >
                  Delete
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Box
                  sx={{
                    width: 256,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {info.training ? 'TRUE' : 'FALSE'}
                </Box>
              </TableCell>
            </TableRow>
            <TableRow sx={{ height: 48 }}>
              <TableCell sx={{ width: 378 }}>
                <Button
                  sx={{ width: 378 }}
                  variant="contained"
                  disabled={isAssessmentTypesMigrationDisabled()}
                  onClick={assessmentTypesMigration}
                >
                  AssessmentTypes Migration
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Button
                  sx={{
                    width: 256,
                  }}
                  variant="contained"
                  onClick={deleteAssessmentTypesMigration}
                >
                  Delete
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Box
                  sx={{
                    width: 256,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {info.assessmentType ? 'TRUE' : 'FALSE'}
                </Box>
              </TableCell>
            </TableRow>
            <TableRow sx={{ height: 48 }}>
              <TableCell sx={{ width: 378 }}>
                <Button
                  sx={{ width: 378 }}
                  variant="contained"
                  disabled={isAssessmentCyclesMigrationDisabled()}
                  onClick={assessmentCyclesMigration}
                >
                  AssessmentCycles Migration
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Button
                  sx={{
                    width: 256,
                  }}
                  variant="contained"
                  onClick={deleteAssessmentCyclesMigration}
                >
                  Delete
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Box
                  sx={{
                    width: 256,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {info.assessmentCycle ? 'TRUE' : 'FALSE'}
                </Box>
              </TableCell>
            </TableRow>
            <TableRow sx={{ height: 48 }}>
              <TableCell sx={{ width: 378 }}>
                <Button
                  sx={{ width: 378 }}
                  variant="contained"
                  disabled={isClientsMigrationDisabled()}
                  onClick={clientUnitsMigration}
                >
                  Clients Migration
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Button
                  sx={{
                    width: 256,
                  }}
                  variant="contained"
                  onClick={deleteClientUnitsMigration}
                >
                  Delete
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Box
                  sx={{
                    width: 256,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {info.clientUnit ? 'TRUE' : 'FALSE'}
                </Box>
              </TableCell>
            </TableRow>
            <TableRow sx={{ height: 48 }}>
              <TableCell sx={{ width: 378 }}>
                <Button
                  sx={{ width: 378 }}
                  variant="contained"
                  disabled={isFindingGroupsMigrationDisabled()}
                  onClick={findingGroupsMigration}
                >
                  Finding Groups Migration
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Button
                  sx={{
                    width: 256,
                  }}
                  variant="contained"
                  onClick={deleteFindingGroupsMigration}
                >
                  Delete
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Box
                  sx={{
                    width: 256,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {info.findingGroup ? 'TRUE' : 'FALSE'}
                </Box>
              </TableCell>
            </TableRow>
            <TableRow sx={{ height: 48 }}>
              <TableCell sx={{ width: 378 }}>
                <Button
                  sx={{ width: 378 }}
                  variant="contained"
                  disabled={isUsersMigrationDisabled()}
                  onClick={usersMigration}
                >
                  Users Migration
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Button
                  sx={{
                    width: 256,
                  }}
                  variant="contained"
                  onClick={deleteUsersMigration}
                >
                  Delete
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Box
                  sx={{
                    width: 256,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {info.user ? 'TRUE' : 'FALSE'}
                </Box>
              </TableCell>
            </TableRow>
            <TableRow sx={{ height: 48 }}>
              <TableCell sx={{ width: 378 }}>
                <Button
                  sx={{ width: 378 }}
                  variant="contained"
                  disabled={isUserSimulationsMigrationDisabled()}
                  onClick={userSimulationsMigration}
                >
                  UserSimulations Migration
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Button
                  sx={{
                    width: 256,
                  }}
                  variant="contained"
                  onClick={deleteUserSimulationsMigration}
                >
                  Delete
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Box
                  sx={{
                    width: 256,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {info.userSimulation ? 'TRUE' : 'FALSE'}
                </Box>
              </TableCell>
            </TableRow>
            <TableRow sx={{ height: 48 }}>
              <TableCell sx={{ width: 378 }}>
                <Button
                  sx={{ width: 378 }}
                  variant="contained"
                  disabled={isNotesMigrationDisabled()}
                  onClick={notesMigration}
                >
                  Notes Migration
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Button
                  sx={{
                    width: 256,
                  }}
                  variant="contained"
                  onClick={deleteNotesMigration}
                >
                  Delete
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Box
                  sx={{
                    width: 256,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {info.note ? 'TRUE' : 'FALSE'}
                </Box>
              </TableCell>
            </TableRow>
            <TableRow sx={{ height: 48 }}>
              <TableCell sx={{ width: 378 }}>
                <Button
                  sx={{ width: 378 }}
                  variant="contained"
                  disabled={isAnswerMigrationDisabled()}
                  onClick={answersMigration}
                >
                  Answers Migration
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Button
                  sx={{
                    width: 256,
                  }}
                  variant="contained"
                  onClick={deleteAnswersMigration}
                >
                  Delete
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Box
                  sx={{
                    width: 256,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {info.answer ? 'TRUE' : 'FALSE'}
                </Box>
              </TableCell>
            </TableRow>
            <TableRow sx={{ height: 48 }}>
              <TableCell sx={{ width: 378 }}>
                <Button
                  sx={{ width: 378 }}
                  variant="contained"
                  disabled={isAssessmentsMigrationDisabled()}
                  onClick={assessmentsMigration}
                >
                  Assessments Migration
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Button
                  sx={{
                    width: 256,
                  }}
                  variant="contained"
                  onClick={deleteAssessmentsMigration}
                >
                  Delete
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Box
                  sx={{
                    width: 256,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {info.assessment ? 'TRUE' : 'FALSE'}
                </Box>
              </TableCell>
            </TableRow>
            <TableRow sx={{ height: 48 }}>
              <TableCell sx={{ width: 378 }}>
                <Button
                  sx={{ width: 378 }}
                  variant="contained"
                  disabled={isUserTrainingsMigrationDisabled()}
                  onClick={userTrainingsMigration}
                >
                  UserTrainings Migration
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Button
                  sx={{
                    width: 256,
                  }}
                  variant="contained"
                  onClick={deleteUserTrainingsMigration}
                >
                  Delete
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Box
                  sx={{
                    width: 256,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {info.userTraining ? 'TRUE' : 'FALSE'}
                </Box>
              </TableCell>
            </TableRow>
            <TableRow sx={{ height: 48 }}>
              <TableCell sx={{ width: 378 }}>
                <Button
                  sx={{ width: 378 }}
                  variant="contained"
                  disabled={isUserAssessmentCyclesMigrationDisabled()}
                  onClick={userAssessmentCyclesMigration}
                >
                  UserAssessmentCycles Migration
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Button
                  sx={{
                    width: 256,
                  }}
                  variant="contained"
                  onClick={deleteUserAssessmentCyclesMigration}
                >
                  Delete
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Box
                  sx={{
                    width: 256,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {info.userAssessmentCycle ? 'TRUE' : 'FALSE'}
                </Box>
              </TableCell>
            </TableRow>
            <TableRow sx={{ height: 48 }}>
              <TableCell sx={{ width: 378 }}>
                <Button
                  sx={{ width: 378 }}
                  variant="contained"
                  disabled={isUserAssessmentCycleSummariesMigrationDisabled()}
                  onClick={userAssessmentCycleSummariesMigration}
                >
                  UserAssessmentCycleSummaries Migration
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Button
                  sx={{
                    width: 256,
                  }}
                  variant="contained"
                  onClick={deleteUserAssessmentCycleSummariesMigration}
                >
                  Delete
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Box
                  sx={{
                    width: 256,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {info.userAssessmentCycleSummary ? 'TRUE' : 'FALSE'}
                </Box>
              </TableCell>
            </TableRow>
            <TableRow sx={{ height: 48 }}>
              <TableCell
                sx={{
                  width: 378,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography>All</Typography>
                </Box>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Button
                  sx={{
                    width: 256,
                  }}
                  variant="contained"
                  onClick={deleteAll}
                >
                  Delete
                </Button>
              </TableCell>
              <TableCell sx={{ width: 256 }}>
                <Box
                  sx={{
                    width: 256,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                ></Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </Box>
  )
}
export default observer(MigrationView)
