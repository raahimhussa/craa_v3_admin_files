import { AppBar, Box, Button, Modal, Toolbar, Typography } from '@mui/material'
import {
  AssessmentStatus,
  ScorerStatus,
  SimulationType,
  UserSimulationStatus,
} from 'src/utils/status'
import {
  MonitoringNotesDto,
  PreviewInfoDto,
  ProcessIssuesDto,
  ResultSummaryDto,
  ScoreByDomainDto,
  ScoreBySeverityDto,
  UnidentifiedFindingsDto,
} from 'src/dto/preview.dto'
import { observer, useLocalObservable } from 'mobx-react'

import Assessment from 'src/models/assessment'
import Preview from './Preview'
import UserSimulation from 'src/models/userSimulation'
import axios from 'axios'
import { useState } from 'react'

function PreviewButtonView({
  assessment,
  userSimulation,
}: {
  assessment: Assessment
  userSimulation: UserSimulation
}) {
  const [previewData, setPreviewData] = useState<{
    previewInfo: PreviewInfoDto
    resultSummary: ResultSummaryDto
    scoreBySeverity: ScoreBySeverityDto
    scoreByDomain: ScoreByDomainDto
    processIssues: ProcessIssuesDto
    unidentifiedFindings: UnidentifiedFindingsDto
    monitoringNotes: MonitoringNotesDto
  } | null>(null)
  const state = useLocalObservable(() => ({
    isOpen: false,
    // payload: null,
  }))

  const onClickPreview = async () => {
    if (userSimulation) {
      try {
        let _previewData = null
        if (userSimulation.simulationType === SimulationType.Baseline) {
          _previewData = (
            await axios.patch(
              `/v3/scoringManagement/userSimulations/${userSimulation._id}/baselinePreview`
            )
          )?.data
        }
        if (userSimulation.simulationType === SimulationType.Followup) {
          _previewData = (
            await axios.patch(
              `/v3/scoringManagement/userSimulations/${userSimulation._id}/followupPreview`
            )
          )?.data
        }
        await axios.patch(`/v1/userAssessmentCycles/renewSummary`)
        setPreviewData(_previewData)
      } catch (error) {
        throw error
      }
    }
    // state.payload = assessmentWithResults
    state.isOpen = true
  }

  const onClickClose = () => {
    state.isOpen = false
  }
  const isAdjudicationCompleted =
    assessment.adjudicator.status === ScorerStatus.Complete
  const isPublished = userSimulation.status === UserSimulationStatus.Published
  const isDistributed =
    userSimulation.status === UserSimulationStatus.Distributed

  return (
    <Box>
      <Button
        disabled={!isAdjudicationCompleted}
        variant="contained"
        onClick={onClickPreview}
      >
        Preview
      </Button>
      <Modal open={state.isOpen}>
        <Box sx={{ maxHeight: '100vh' }}>
          <AppBar position="static">
            <Toolbar
              sx={{
                heigth: '40px',
              }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, fontWeight: 700 }}
              >
                Preview
              </Typography>
              <Button
                onClick={onClickClose}
                color="inherit"
                sx={{
                  fontWeight: 700,
                  '&:hover': {
                    color: 'white !important',
                  },
                }}
              >
                Close
              </Button>
            </Toolbar>
          </AppBar>
          <Box sx={{ overflow: 'auto', maxHeight: 'calc(100vh - 46px)' }}>
            <Preview userSimulationId={userSimulation._id} />
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}
export default observer(PreviewButtonView)
