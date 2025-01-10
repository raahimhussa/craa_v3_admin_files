import {
  AssessmentStatus,
  ScorerStatus,
  UserSimulationStatus,
} from 'src/utils/status'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Paper,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'

import Assessment from 'src/models/assessment'
import AssessmentTopBar from './AssessmentTopBar/AssessmentTopBar'
import Findings from './Findings/Findings'
import { INote } from 'src/models/note/note.interface'
import MNotes from './MNotes/MNotes'
import UserSimulation from 'src/models/userSimulation'
import _ from 'lodash'
import axios from 'axios'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import { useLocation } from 'react-router-dom'
import { useRootStore } from 'src/stores'

function AssessmentView(props: {
  userSimulation: UserSimulation
  assessment: Assessment
}) {
  const {
    authStore: { user },
    assessmentStore,
    uiState: { assessment: assessmentUi },
  } = useRootStore()
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedNote, setSelectedNote] = useState<INote>()
  const { userSimulation, assessment } = props
  const location = useLocation()
  const disabled = (location?.state as any)?.disabled as boolean

  useEffect(() => {
    assessmentUi.setScorerType(assessment, user._id)
    setLoading(false)
    if (disabled) return
    ;(async () => {
      await axios.patch('v2/assessments', {
        filter: {
          _id: assessment._id,
        },
        update: {
          $set: {
            status: 'InProgress',
            [`${assessmentUi.scorerType}.status`]: ScorerStatus.InProgress,
          },
        },
      })
      await axios.patch('v2/userSimulations', { // v2/userSimulation doesn't exist
        filter: {
          assessmentId: assessment._id,
          userId: user._id,
        },
        update: {
          $set: {
            status: UserSimulationStatus.Scoring,
          },
        },
      })
    })()
  }, [])

  if (!userSimulation || loading) return null

  return (
    <Paper
      sx={{
        p: 2,
        mt: 2,
        height: 'calc(100vh - 85px)',
        pr: '0',
        pb: 0,
        borderBottom: 'none !important',
      }}
      className="paper-grid"
    >
      <Grid
        container
        item
        xs={12}
        spacing={2}
        sx={{ height: 'calc(100% - 30px)' }}
      >
        <Grid item xs={12}>
          <AssessmentTopBar
            userSimulation={userSimulation}
            selectedNote={selectedNote}
            setSelectedNote={setSelectedNote}
            pageDisabled={disabled}
          />
        </Grid>
        {assessmentStore.showScoringBoard ? (
          <>
            <Grid item xs={6} sx={{ height: '100%', pl: '0 !important' }}>
              <Card
                className="paper-grid"
                sx={{ height: '100%', p: 0, overflow: 'auto' }}
              >
                <CardHeader title="MN Notes" sx={{ p: 2 }} />
                <CardContent sx={{ pt: 0, pl: 0, pr: 0 }}>
                  <MNotes
                    userSimulation={userSimulation}
                    setSelectedNote={setSelectedNote}
                    selectedNote={selectedNote}
                    pageDisabled={disabled}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sx={{ height: '100%' }}>
              <Card
                className="paper-grid"
                sx={{ height: '100%', p: 0, overflow: 'auto' }}
              >
                <CardHeader title="Findings" sx={{ p: 2 }} />
                <CardContent sx={{ pt: 0, pl: 0, pr: 0 }}>
                  <Findings
                    userSimulation={userSimulation}
                    pageDisabled={disabled}
                    firstScorerId={assessment.firstScorer._id}
                    secondScorerId={assessment.secondScorer._id}
                  />
                </CardContent>
              </Card>
            </Grid>
          </>
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <Card
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#bbbbbb',
                width: '96%',
                height: '96%',
              }}
            >
              <Typography
                sx={{ fontSize: 48, fontWeight: 600, color: 'black' }}
              >
                Press Resume
              </Typography>
            </Card>
          </Box>
        )}
      </Grid>
    </Paper>
  )
}

export default observer(AssessmentView)
