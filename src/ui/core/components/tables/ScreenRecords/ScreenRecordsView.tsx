import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import Badge, { BadgeProps } from '@mui/material/Badge'
import { observer, useLocalObservable } from 'mobx-react'
import { useEffect, useRef, useState } from 'react'

import Bookmarks from './Bookmarks/Bookmarks'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import IconButton from '@mui/material/IconButton'
import Logs from './_Logs/Logs'
import EditIcon from '@mui/icons-material/Edit'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import DeleteIcon from '@mui/icons-material/Delete'
import NoteIcon from '@mui/icons-material/Note'
import Notes from './Notes/Notes'
import Video from './Video'
import axios from 'axios'
import { grey } from '@mui/material/colors'
import moment from 'moment'
import palette from 'src/theme/palette'
import { styled } from '@mui/material/styles'
import uniqid from 'uniqid'
import { useRootStore } from 'src/stores'
import { writeFile } from 'fs/promises'

function ScreenRecordsView({
  screenRecorders,
  userSimulationId,
  type,
  logs,
}: any) {
  const {
    uiState,
    screenRecorderStore,
    uiState: { modal },
  } = useRootStore()

  const [url, setUrl] = useState<object[]>([])
  const [noteCnt, setNoteCnt] = useState<any>({ add: 0, edit: 0, delete: 0 })
  const [isDone, setIsDone] = useState(false)
  // const localState = useLocalObservable(() => ({
  //   url: '',
  //   file: null,
  //   progress: 0,
  //   isLoading: true,
  //   message: '',
  //   totalChunkCount: screenRecorder.recorders.length,
  //   downloadChunkCount: 0,
  // }))

  const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -1,
      top: 4,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
    },
  }))

  const screenRecords = uiState.screenRecords
  // const ratio = localState.downloadChunkCount / localState.totalChunkCount
  async function checkFileExists(fileKey: string) {
    const param = {
      fileKey: fileKey,
    }
    const data = await axios.post(
      'https://craa-sr-dev-3.hoansoft.com/v1/isExist',
      param
    )
    // console.log(isExist)
    return data
  }

  useEffect(() => {
    setExpanded(screenRecorderStore.recordId)
  }, [screenRecorderStore.recordId])

  useEffect(() => {
    let obj: any = {}
    if (screenRecorders !== undefined) {
      screenRecorders[0]?.recorders.map((record: any) => {
        const recordId = record.info.recordId
        checkFileExists(`${userSimulationId}_${recordId}`).then((res) => {
          if (!res.data) {
            const param = {
              userSimulationId: userSimulationId,
              recordId: recordId,
            }
            axios.post(
              'https://craa-sr-dev-3.hoansoft.com/v1/createVideo',
              param
            )
          }
        })
        let acnt = 0
        let dcnt = 0
        let ecnt = 0
        logs.map((log: any) => {
          if (log.recordId === recordId) {
            if (log.event === 'addNote') {
              acnt++
            } else if (log.event === 'saveNote') {
              ecnt++
            } else if (log.event === 'deleteNote') {
              dcnt++
            }
          }
        })
        obj[recordId] = {
          add: acnt,
          delete: dcnt,
          edit: ecnt,
        }
      })
      setNoteCnt(obj)
    }
  }, [])
  const [expanded, setExpanded] = useState<string | false>(false)
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      screenRecorderStore.recordId = panel
      setExpanded(isExpanded ? panel : false)
      location.href = `#${panel}`
    }

  return (
    <div style={{ height: '100%' }}>
      <Box
        sx={{
          background: palette.light.background.header,
          display: 'flex',
          justifyContent: 'space-between',
          pb: 3.5,
          alignItems: 'center',
          pt: 1.3,
        }}
      >
        <Typography sx={{ color: 'white', fontWeight: 700, pl: 2 }}>
          Screen Logs
        </Typography>
        <Button
          sx={{ color: 'white', mr: 1 }}
          onClick={() => {
            modal.close()
          }}
        >
          Close
        </Button>
      </Box>
      <Grid
        container
        spacing={2}
        className="logModal"
        sx={{
          bgcolor: grey[100],
          height: '100%',
          p: 2,
        }}
      >
        <Grid
          item
          xs={8}
          sx={{
            height: '92%',
            overflowY: 'auto',
            paddingTop: '0 !important',
            overflowX: 'hidden',
          }}
        >
          {screenRecorders[0]?.recorders.map((record: any, i: any) => (
            <div>
              <Accordion
                expanded={expanded === record.info.recordId}
                onChange={handleChange(record.info.recordId)}
                sx={{ borderRadius: '2px !important' }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '100% !important',
                    }}
                  >
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                      video&nbsp;-&nbsp;{i + 1}
                    </Typography>
                    <Box sx={{ display: 'flex', mr: 3, alignItems: 'center' }}>
                      <IconButton>
                        <StyledBadge
                          badgeContent={noteCnt[record.info.recordId]?.add}
                          color="info"
                          showZero
                        >
                          <NoteIcon />
                        </StyledBadge>
                      </IconButton>
                      <IconButton
                        sx={{
                          mt: -2.8,
                        }}
                      >
                        <StyledBadge
                          badgeContent={noteCnt[record.info.recordId]?.edit}
                          color="warning"
                          showZero
                        >
                          {/* <EditIcon /> */}
                        </StyledBadge>
                      </IconButton>
                      <IconButton
                        sx={{
                          mt: -2.7,
                        }}
                      >
                        <StyledBadge
                          badgeContent={noteCnt[record.info.recordId]?.delete}
                          color="error"
                          showZero
                        >
                          {/* <DeleteIcon /> */}
                        </StyledBadge>
                      </IconButton>
                      <Typography
                        sx={{
                          flexShrink: 0,
                          ml: 1,
                          width: '75px',
                          textAlign: 'right',
                        }}
                      >
                        {moment
                          .utc(
                            i === 0
                              ? 0
                              : screenRecorders[0]?.recorders[i - 1]?.info
                                  ?.startSec * 1000
                          )
                          .format('HH:mm:ss')}
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {expanded === record.info.recordId ? (
                    <Video
                      url={`https://craa-sr-data.s3.us-east-2.amazonaws.com/${userSimulationId}_${record.info.recordId}.webm`}
                      index={i}
                      recordId={record.info.recordId}
                      start={
                        i === 0
                          ? 0
                          : screenRecorders[0]?.recorders[i - 1]?.info?.startSec
                      }
                    />
                  ) : (
                    <></>
                  )}
                </AccordionDetails>
              </Accordion>
            </div>
          ))}
        </Grid>
        <Grid
          item
          xs={4}
          sx={{ paddingTop: '0 !important', height: '92% !important' }}
        >
          <Paper
            sx={{
              p: 2,
              borderRadius: '2px',
              height: '100%',
            }}
          >
            <Tabs
              value={screenRecords.selectedTab().text}
              sx={{ flex: 1, display: 'flex' }}
            >
              {screenRecords.tabs.map((tab: any) => {
                return (
                  <Tab
                    sx={{ flex: 1 }}
                    key={uniqid()}
                    value={tab.text}
                    label={tab.text}
                    onClick={() => screenRecords.onClickTab(tab.text)}
                  />
                )
              })}
            </Tabs>
            {screenRecords.tabs[0].selected && (
              <Logs
                userSimulationId={userSimulationId}
                type={type}
                recordId={expanded}
                recorders={screenRecorders[0]?.recorders}
              />
            )}
            {screenRecords.tabs[1].selected && (
              <Notes
                userSimulationId={userSimulationId}
                type={type}
                recordId={expanded}
                recorders={screenRecorders[0]?.recorders}
              />
            )}
            {screenRecords.tabs[2].selected && (
              <Bookmarks
                userSimulationId={userSimulationId}
                type={type}
                recorders={screenRecorders[0]?.recorders}
              />
            )}
          </Paper>
        </Grid>
        {/* <LinearProgress variant="determinate" value={100 * ratio} /> */}
        {/* {screenRecorders !== undefined ? (
            screenRecorders[0].recorders.map((record: any, i: any) => <></>)
          ) : (
            <Box
              sx={{
                width: '100vw',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
              }}
            >
              <Typography>No Screen record data available.</Typography>
            </Box>
          )} */}
      </Grid>
    </div>
  )
}
export default observer(ScreenRecordsView)
