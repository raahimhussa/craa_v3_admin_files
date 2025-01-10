import {
  Box,
  Button,
  Divider,
  IconButton,
  InputBase,
  InputProps,
  Paper,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { observer, useLocalStore } from 'mobx-react'
import { useEffect, useState } from 'react'

import ILog from 'src/models/log/types'
import { Delete, Search } from '@mui/icons-material'
import Spacer from 'src/ui/core/components/Spacer/Spacer'
import moment from 'moment'
import palette from 'src/theme/palette'
import uniqid from 'uniqid'
import { useRootStore } from 'src/stores'
import EditIcon from '@mui/icons-material/Edit'

const Notes = ({
  logs,
  recordId,
  recorders,
}: {
  logs: ILog[]
  userSimulationId: string
  recordId: any
  recorders: any
}) => {
  const { screenRecorderStore, uiState } = useRootStore()
  const localState = useLocalStore(() => ({
    searchText: '',
  }))
  const [recordid, setRecordid] = useState('')
  const [noteId, setNoteId] = useState('')
  const [logId, setLogId] = useState('')

  useEffect(() => {
    setRecordid(recordId)
  }, [recordId])

  return (
    <Box
      sx={{
        height: uiState.windowDimensions.height - 180,
        overflowY: 'scroll',
      }}
    >
      {/* <SearchInput onChange={(e) => (localState.searchText = e.target.value)} />
      <Spacer spacing={2} /> */}
      <TableBody className="logtable">
        {logs.map((log) => {
          if (log.note !== null) {
            return (
              <>
                <TableRow
                  hover
                  key={uniqid()}
                  sx={{
                    bgcolor:
                      log.recordId !== recordid
                        ? '#f2f2f2  !important'
                        : 'white !important',
                    p: '2rem !important',
                  }}
                >
                  <TableCell
                    sx={{
                      width: '80%',
                      borderBottom: '1px solid #cccccc !important',
                    }}
                  >
                    {log.note?.type !== 'compliance' ? (
                      <Typography
                        sx={{
                          lineHeight: '1.4 !important',
                          fontSize: '14.5px',
                          p: 1,
                          mb: 1,
                          width: '100%',
                          wordBreak: 'break-word',
                          position: 'relative',
                        }}
                        // className="blinkRow"
                      >
                        {log.note?._id === noteId ? (
                          <Box
                            className="blinkRow"
                            sx={{
                              width: '10px',
                              height: '10px',
                              position: 'absolute',
                              borderRadius: '50%',
                              ml: -1.8,
                              mt: -1,
                            }}
                          ></Box>
                        ) : (
                          <></>
                        )}{' '}
                        {log.note?.text}
                      </Typography>
                    ) : (
                      <Box sx={{ p: 1 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            position: 'relative',
                          }}
                        >
                          {log.note?._id === noteId ? (
                            <Box
                              className="blinkRow"
                              sx={{
                                width: '10px',
                                height: '10px',
                                position: 'absolute',
                                borderRadius: '50%',
                                ml: -1.8,
                                mt: -2.5,
                              }}
                            ></Box>
                          ) : (
                            <></>
                          )}
                          <Typography
                            sx={{
                              lineHeight: '1.4 !important',
                              fontSize: '14.5px',
                              // width: '290px',
                              mr: 1,
                            }}
                          >
                            taken by subject
                          </Typography>
                          <Typography
                            sx={{
                              lineHeight: '1.4 !important',
                              fontSize: '14.5px',
                              border: '1px solid black',
                              borderColor: palette.light.divider,
                              py: 0.5,
                              width: '55px',
                              px: 0.5,
                            }}
                          >
                            {log.note?.complianceNote?.taken}
                          </Typography>
                        </Box>
                        {log.note?.complianceNote?.shouldTaken !== '' ? (
                          <>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                my: 1,
                                justifyContent: 'space-between',
                              }}
                            >
                              <Typography
                                sx={{
                                  lineHeight: '1.4 !important',
                                  fontSize: '14.5px',
                                  // width: '290px',
                                  mr: 1,
                                }}
                              >
                                should have been taken by subject
                              </Typography>
                              <Typography
                                sx={{
                                  lineHeight: '1.4 !important',
                                  fontSize: '14.5px',
                                  border: '1px solid black',
                                  borderColor: palette.light.divider,
                                  py: 0.5,
                                  width: '55px',
                                  px: 0.5,
                                }}
                              >
                                {log.note?.complianceNote?.shouldTaken}
                              </Typography>
                            </Box>
                          </>
                        ) : (
                          <></>
                        )}
                        {log.note?.complianceNote?.percent !== '' ? (
                          <>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Typography
                                sx={{
                                  lineHeight: '1.4 !important',
                                  fontSize: '14.5px',
                                  // width: '290px',
                                  mr: 1,
                                }}
                              >
                                Percent Compliance
                              </Typography>
                              <Typography
                                sx={{
                                  lineHeight: '1.4 !important',
                                  fontSize: '14.5px',
                                  border: '1px solid black',
                                  borderColor: palette.light.divider,
                                  py: 0.5,
                                  width: '55px',
                                  px: 0.5,
                                }}
                              >
                                {log.note?.complianceNote?.percent}%
                              </Typography>
                            </Box>
                          </>
                        ) : (
                          <></>
                        )}
                      </Box>
                    )}
                  </TableCell>
                  <TableCell
                    sx={{ borderBottom: '1px solid #cccccc !important' }}
                  >
                    {moment.utc(log.duration * 1000).format('HH:mm:ss')}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottom: '1px solid #cccccc !important',
                      position: 'relative',
                    }}
                  >
                    <Button
                      onClick={() => {
                        setLogId(log._id)
                        const index = recorders.findIndex(
                          (record: any) => record.info.recordId === recordid
                        )
                        const start =
                          index === 0 ? 0 : recorders[index - 1]?.info?.startSec
                        screenRecorderStore.play(log.duration, start)
                      }}
                      // onClick={() =>
                      //   screenRecorderStore.play(
                      //     log.duration,
                      //     logs[logs.length - 1].duration
                      //   )
                      // }
                      sx={{
                        borderColor:
                          logId === log._id
                            ? '#396d82 !important'
                            : 'rgb(84, 91, 100) !important',
                        borderWidth:
                          logId === log._id
                            ? '2px !important'
                            : '1px !important',
                        minWidth: '10px',
                      }}
                      variant="outlined"
                      size="small"
                      disabled={log.recordId != recordid}
                    >
                      View
                    </Button>
                    {log.event === 'saveNote' ? (
                      <Button
                        sx={{
                          minWidth: '10px',
                          position: 'absolute',
                          bgcolor: palette.light.button.yellow,
                          borderRadius: '50% !important',
                          right: 0,
                          height: '20px !important',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: 0.5,
                          width: '20px',
                          top: 0,
                          '&:hover': {
                            bgcolor: '#e68a00',
                          },
                        }}
                        onClick={() => {
                          setNoteId(log.note?._id!)
                        }}
                      >
                        <EditIcon
                          sx={{
                            fontSize: 14,
                            color: 'white',
                          }}
                        />
                      </Button>
                    ) : (
                      <></>
                    )}
                    {log.event === 'deleteNote' ? (
                      <Button
                        sx={{
                          minWidth: '10px',
                          position: 'absolute',
                          bgcolor: palette.light.button.red,
                          borderRadius: '50% !important',
                          right: 0,
                          height: '20px !important',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: 0.5,
                          width: '20px',
                          top: 0,
                          '&:hover': {
                            bgcolor: '#bc2d10',
                          },
                        }}
                        onClick={() => {
                          setNoteId(log.note?._id!)
                        }}
                      >
                        <Delete
                          sx={{
                            fontSize: 14,
                            color: 'white',
                          }}
                        />
                      </Button>
                    ) : (
                      <></>
                    )}
                  </TableCell>
                </TableRow>
              </>
            )
          } else {
            return <></>
          }
        })}
      </TableBody>
    </Box>
  )
}

export default observer(Notes)

export const SearchInput = (props: InputProps) => {
  return (
    <Paper
      component="span"
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        flex: 1,
      }}
    >
      <InputBase {...props} sx={{ ml: 1, flex: 1 }} placeholder={`Search`} />
      <IconButton sx={{ p: '10px' }}>
        <Search />
      </IconButton>
    </Paper>
  )
}
