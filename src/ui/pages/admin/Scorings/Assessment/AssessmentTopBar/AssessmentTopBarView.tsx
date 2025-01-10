import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import _, { some } from 'lodash'
import { observer, useLocalObservable } from 'mobx-react'
import { reaction, toJS } from 'mobx'
import { useEffect, useState } from 'react'
import { useStopwatch, useTimer } from 'react-timer-hook'

import Assessment from 'src/models/assessment'
import { AssessmentScorerType } from 'src/stores/ui/pages/assessment'
import Draggable from 'react-draggable'
import { IAssessment } from 'src/models/assessment/assessment.interface'
import { INote } from 'src/models/note/note.interface'
import { ISimDoc } from 'src/models/simDoc/types'
import IUser from 'src/models/user/user.interface'
import PDFViewer from './PDFViewer/PDFViewer'
import RoadmapView from './RoadmapView'
import SelectDocument from '../SelectDocument/SelectDocument'
import User from 'src/models/user'
import UserSimulation from 'src/models/userSimulation'
import axios from 'axios'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'
import { useUser } from '@hooks'

function AssessmentTopBarView({
  userSimulation,
  assessment,
  user,
  userSimulations,
  selectedNote,
  setSelectedNote,
  pageDisabled,
}: {
  userSimulation: UserSimulation
  assessment: Assessment
  user: User
  userSimulations: UserSimulation[]
  selectedNote: INote
  setSelectedNote: any
  pageDisabled?: boolean
}) {
  const { noteStore } = useRootStore()
  const [simDocs, setSimDocs] = useState<(ISimDoc & { open: boolean })[]>([])
  const [isRoadmap, setIsRoadmap] = useState(false)

  const onClickOpenPDF = (_simDoc: ISimDoc) => {
    setSimDocs((prev) => {
      if (prev.find((_sd) => _sd._id === _simDoc._id)) {
        return [...prev].map((_sd) => {
          if (_sd._id === _simDoc._id) return { ..._sd, open: true }
          return { ..._sd }
        })
      }
      return [...prev, { ..._simDoc, open: true }]
    })
  }
  const onClickClosePDF = (_simDoc: ISimDoc) => {
    setSimDocs((prev) =>
      [...prev].map((_sd) => {
        if (_sd._id !== _simDoc._id) return _sd
        return { ..._sd, open: false }
      })
    )
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', flex: 1 }}>
          <Box sx={{ mr: 1 }}>
            <SelectDocument
              simulationId={userSimulation.simulationId}
              onClickOpenPDF={onClickOpenPDF}
            />
          </Box>
          <Button
            variant="contained"
            onClick={() => {
              setIsRoadmap(!isRoadmap)
            }}
          >
            Roadmap
          </Button>
          {isRoadmap ? (
            <RoadmapView
              userSimulation={userSimulations[0]}
              user={user}
              setIsRoadmap={setIsRoadmap}
              selectedNote={selectedNote}
              setSelectedNote={setSelectedNote}
            />
          ) : (
            <></>
          )}
          <Button variant="text" color="info">
            monitoring notes :{' '}
            {toJS(noteStore.notes)
              ? toJS(noteStore.notes?.length ? noteStore.notes?.length : '-')
              : '-'}
          </Button>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Timer assessment={assessment} pageDisabled={pageDisabled} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <UserInitial user={user} />
        </Box>
      </Box>
      {simDocs.map((_simDoc) =>
        _simDoc.open ? (
          <PDFViewer
            title={`${_simDoc?.title} / ${_simDoc.files[0]?.name}`}
            fileUrl={_simDoc.files[0]?.url}
            onClose={() => onClickClosePDF(_simDoc)}
          />
        ) : null
      )}
    </>
  )
}

const Timer = observer(
  ({
    assessment,
    pageDisabled,
  }: {
    assessment: IAssessment
    pageDisabled?: boolean
  }) => {
    const {
      assessmentStore,
      routerStore,
      noteStore,
      answerStore,
      uiState: {
        assessment: { scorerType },
      },
    } = useRootStore()
    const navigate = useNavigate()
    const user = useUser()

    const _scoringTime = (assessment[scorerType] as any).scoringTime;   
    const offsetTimestamp = new Date(); 
    offsetTimestamp.setSeconds(offsetTimestamp.getSeconds() + _scoringTime);

    const { seconds, minutes, hours, start, pause } = useStopwatch({
      autoStart: pageDisabled ? false : true,
      // offsetTimestamp: new Date(
      //   new Date().setSeconds(
      //     new Date().getSeconds() +
      //       ((assessment[scorerType] as any).scoringTime
      //         ? (assessment[scorerType] as any).scoringTime
      //         : 0)
      //   )
      // ),
      offsetTimestamp: offsetTimestamp
    })
    const { enqueueSnackbar } = useSnackbar()
    const timer = useLocalObservable(() => ({
      state: 'start',
    }))
    const [open, setOpen] = useState(false)

    const handleClickOpen = () => {
      setOpen(true)
    }

    const handleClose = () => {
      setOpen(false)
    }

    useEffect(() => {
      !pageDisabled && start()
      assessmentStore.showValidationScoring = false
      assessmentStore.showScoringBoard = true
      // console.log("AssessmentTopBarView::assessment ", assessment);
    }, [])

    useEffect(() => {      
      if (scorerType === AssessmentScorerType.Adjudicator) return
      else
        (async () => {

          // const _scoringTime = (assessment[scorerType] as any).scoringTime;                 

          // Calculate total seconds including the initial offset
          // const totalSeconds = hours * 3600 + minutes * 60 + seconds + _scoringTime;
          const totalSeconds = hours * 3600 + minutes * 60 + seconds;

          // Convert total seconds back to hours, minutes, and seconds
          // const adjustedHours = Math.floor(totalSeconds / 3600);
          // const adjustedMinutes = Math.floor((totalSeconds % 3600) / 60);
          // const adjustedSeconds = totalSeconds % 60;

          // console.log("adjustedHours: ", adjustedHours)
          // console.log("adjustedMinutes: ", adjustedMinutes)
          // console.log("adjustedSeconds: ", adjustedSeconds)

          // console.log("assessmentStore: ", assessmentStore)
          // console.log("Timer calculation: ", _scoringTime, hours, minutes, seconds, totalSeconds)

          const _scoringTimeUpdated = await axios.patch('v2/assessments', {
            filter: { _id: assessment._id },
            update: {
              $set: {
                [`${scorerType}.scoringTime`]:
                  // hours * 3600 + minutes * 60 + seconds,
                  totalSeconds
              },
            },
          })
          
          if(_scoringTimeUpdated?.status === 200) {            
            (assessment[scorerType] as any).scoringTime = totalSeconds;
          }
        })()
    // }, [seconds % 5 === 0])
    }, [seconds])

    const isNotAdjudicator = !(scorerType === AssessmentScorerType.Adjudicator)

    return (
      <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
        {isNotAdjudicator && (
          <Button
            onClick={() => {
              if (timer.state === 'pause') {
                timer.state = 'resume'
                assessmentStore.showScoringBoard = true
                start()
              } else {
                timer.state = 'pause'
                assessmentStore.showScoringBoard = false
                pause()
              }
            }}
            disabled={pageDisabled}
            size="small"
            variant="outlined"
            color="info"
          >
            {timer.state === 'pause' ? 'resume' : 'pause'}
          </Button>
        )}
        {isNotAdjudicator && (
          <Button sx={{ mx: 1 }} variant="outlined" color="warning">
            {`${hours.toString().padStart(2, '0')}: ${minutes
              .toString()
              .padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`}
          </Button>
        )}
        <Button
          onClick={async () => {
            if (scorerType === AssessmentScorerType.Adjudicator) {
              if (
                noteStore.unhandledNonErrorCount(scorerType, user.data._id) >
                  0 ||
                noteStore.notReadyToSubmitCount(scorerType) > 0 ||
                answerStore.notReadyToSubmitCount(scorerType) > 0
              ) {
                handleClickOpen()
                return (assessmentStore.showValidationScoring = true)
              }
            } else {
              if (
                noteStore.notReadyToSubmitCount(scorerType) > 0 ||
                answerStore.notReadyToSubmitCount(scorerType) > 0
              ) {
                handleClickOpen()
                return (assessmentStore.showValidationScoring = true)
              }
            }
            try {
              isNotAdjudicator
                ? await assessmentStore.submitScoring(assessment)
                : await assessmentStore.submitAdjudicate(assessment)
              await axios.get(`v2/assessments/${assessment._id}/setAdjudicator`)
              isNotAdjudicator
                ? routerStore.router &&
                  routerStore.router('admin/scoring/score')
                : routerStore.router &&
                  routerStore.router('admin/scoring/adjudicate')
              enqueueSnackbar('Successfully submitted', {
                variant: 'success',
              })
            } catch (error) {
              enqueueSnackbar('Submit failed', {
                variant: 'error',
              })
              console.error(error)
            }
          }}
          disabled={pageDisabled}
          variant="contained"
        >
          Submit
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" sx={{ mb: 2 }}>
            Can't submit scoring yet. Please check condition(s) below.
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {scorerType === AssessmentScorerType.Adjudicator &&
              noteStore.unhandledNonErrorCount(scorerType, user.data._id) >
                0 ? (
                <Box>
                  - You have{' '}
                  {noteStore.unhandledNonErrorCount(scorerType, user.data._id)}{' '}
                  unhandled non-error(s). (Non Error)
                </Box>
              ) : null}
              {noteStore.notReadyToSubmitCount(scorerType) > 0 ? (
                <Box>
                  - You have {noteStore.notReadyToSubmitCount(scorerType)}{' '}
                  unchecked view(s). (MN Notes)
                </Box>
              ) : null}
              {answerStore.notReadyToSubmitCount(scorerType) > 0 ? (
                <Box>
                  - You have {answerStore.notReadyToSubmitCount(scorerType)}{' '}
                  unfinished scoring(s). (Findings)
                </Box>
              ) : null}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Okay</Button>
          </DialogActions>
        </Dialog>
      </Box>
    )
  }
)

const UserInitial = observer(({ user }: { user: IUser }) => {
  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
    >
      <Button variant="text">User Initial: {user.profile?.initial}</Button>
    </Box>
  )
})

export default observer(AssessmentTopBarView)
