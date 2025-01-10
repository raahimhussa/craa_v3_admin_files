import { Box, Button, TableBody, TableCell, TableRow } from '@mui/material'
import { csCZ } from '@mui/material/locale'
import { observer } from 'mobx-react'
import moment from 'moment'
import { useEffect, useState } from 'react'
import Log from 'src/models/log'
import { useRootStore } from 'src/stores'
const Logs = ({
  logs,
  recordId,
  recorders,
}: {
  logs: Log[]
  recordId: any
  recorders: any
}) => {
  const { uiState, screenRecorderStore } = useRootStore()
  const [recordid, setRecordid] = useState('none')
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
      <TableBody className="logtable">
        {logs.map((log: any) => {
          return (
            <TableRow
              hover
              sx={{
                bgcolor:
                  log.recordId != recordid
                    ? '#f2f2f2  !important'
                    : 'white !important',
              }}
            >
              <TableCell
                sx={{
                  width: '80%',
                  //   color:
                  //     i != videoIndex
                  //       ? '#b3b3b3  !important'
                  //       : '#212B36 !important',
                }}
              >
                {log.event}
              </TableCell>
              <TableCell
              // sx={{
              //   color:
              //     i != videoIndex
              //       ? '#b3b3b3  !important'
              //       : '#212B36 !important',
              // }}
              >
                {moment.utc(log.duration * 1000).format('HH:mm:ss')}
              </TableCell>
              <TableCell>
                <Button
                  disabled={log.recordId != recordid}
                  onClick={() => {
                    setLogId(log._id)
                    // const start = logs.filter(
                    //   (log) => log.recordId === recordid
                    // )[0].duration
                    const index = recorders.findIndex(
                      (record: any) => record.info.recordId === recordid
                    )
                    const start =
                      index === 0 ? 0 : recorders[index - 1]?.info?.startSec
                    screenRecorderStore.play(log.duration, start)
                    // screenRecorderStore.recordId = log.recordId
                    // setTimeout(() => {
                    //   screenRecorderStore.play(log.duration, start)
                    // }, 1000)
                  }}
                  variant="outlined"
                  id={log.recordId}
                  sx={{
                    borderColor:
                      logId === log._id
                        ? '#396d82 !important'
                        : 'rgb(84, 91, 100) !important',
                    borderWidth:
                      logId === log._id ? '2px !important' : '1px !important',
                  }}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          )
        })}
        {/* {data.map((arr, i) => {
          return (
            <>
              {arr.map((log: any) => {
                return (
                  <TableRow
                    hover
                    sx={{
                      bgcolor:
                        i != videoIndex
                          ? '#f2f2f2  !important'
                          : 'white !important',
                    }}
                  >
                    <TableCell
                      sx={{
                        width: '80%',
                        //   color:
                        //     i != videoIndex
                        //       ? '#b3b3b3  !important'
                        //       : '#212B36 !important',
                      }}
                    >
                      {log.event}
                    </TableCell>
                    <TableCell
                    // sx={{
                    //   color:
                    //     i != videoIndex
                    //       ? '#b3b3b3  !important'
                    //       : '#212B36 !important',
                    // }}
                    >
                      {moment.utc(log.duration * 1000).format('HH:mm:ss')}
                    </TableCell>
                    <TableCell>
                      <Button
                        disabled={i != videoIndex}
                        onClick={() =>
                          screenRecorderStore.play(
                            log.duration,
                            logs[logs.length - 1].duration
                          )
                        }
                        variant="outlined"
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </>
          )
        })} */}
      </TableBody>
    </Box>
  )
}

export default observer(Logs)
