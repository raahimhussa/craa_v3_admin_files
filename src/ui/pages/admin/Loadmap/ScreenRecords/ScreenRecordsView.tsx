import {
  Box,
  Button,
  Card,
  Stack,
  Typography,
  Skeleton,
  IconButton,
  LinearProgress,
} from '@mui/material'
import IUser, { LocalUser } from 'src/models/user/user.interface'
import IDomain from 'src/models/domain/domain.interface'
import ReactApexChart from 'react-apexcharts'
import UserSimulation from 'src/models/userSimulation'
import _ from 'lodash'
import { observer, useLocalObservable } from 'mobx-react'
import Folder from 'src/models/folder'
import { useEffect, useState } from 'react'
import { useRootStore } from 'src/stores'
import Log from 'src/models/log'
import ClearIcon from '@mui/icons-material/Clear'
import { ScreenRecorder } from 'src/models/screenRecorder'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import axios from 'axios'
import Video from '@components/tables/ScreenRecords/Video'
import HourglassTopIcon from '@mui/icons-material/HourglassTop'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'

type UserInfoProps = {
  user: IUser & LocalUser
  userSimulation: UserSimulation
  logs: Log[]
  setIsLoading: any
  isLoading: boolean
  screenRecorder: ScreenRecorder
  isModal: boolean
}

export default observer((props: UserInfoProps) => {
  const {
    logs,
    userSimulation,
    setIsLoading,
    isLoading,
    screenRecorder,
    isModal,
  } = props
  const { userSimulationStore, simDocStore, folderStore, screenRecorderStore } =
    useRootStore()
  const [url, setUrl] = useState<any[]>([])
  const [videoIndex, setVideoIndex] = useState(null)
  // const [isExist, setIsExist] = useState(false)

  // async function checkFileExists(fileKey: string) {
  //   const param = {
  //     fileKey: fileKey,
  //   }
  //   console.log(fileKey)
  //   const data = await axios.post(
  //     'https://craa-sr-dev-3.hoansoft.com/v1/isExist',
  //     param
  //   )
  //   // const data = await axios.post('http://0.0.0.0:4001/v1/isExist', param)
  //   // console.log(isExist)
  //   return data
  // }

  useEffect(() => {
    // screenRecorder.recorders.map((record: any) => {
    //   const recordId = record.info.recordId
    //   checkFileExists(`${userSimulation._id}_${recordId}`).then((res) => {
    //     if (!res.data) {
    //       const param = {
    //         userSimulationId: userSimulation._id,
    //         recordId: recordId,
    //       }
    //       axios.post(
    //         'https://craa-sr-dev-3.hoansoft.com/v1/createVideo',
    //         param
    //       )
    //       // axios.post('http://0.0.0.0:4001/v1/createVideo', param)
    //     }
    //   })
    // })
    screenRecorderStore.recordId = ''
  }, [])

  return (
    <>
      {isLoading ? (
        <Skeleton variant="rectangular" width={'100%'} height={80} />
      ) : (
        <Box sx={{ position: 'relative' }}>
          <Stack
            spacing={3}
            sx={{ px: 1, width: '100%', position: 'relative' }}
          >
            <Card
              sx={{
                pl: '4.5rem',
                position: 'relative',
                width: '100%',
                borderRadius: '0 !important',
              }}
            >
              <Typography
                sx={{
                  position: 'absolute',
                  top: 20,
                  left: 15,
                  fontSize: '11px',
                }}
              >
                Screen <br />
                Records
              </Typography>
              <Box sx={{ display: 'flex', height: '80px', py: 1 }}>
                {/* <LinearProgress variant="determinate" value={100 * ratio} /> */}
                {screenRecorder.recorders.map((record, i) => {
                  return (
                    <>
                      <Box
                        sx={{
                          // bgcolor: '#f2f2f2',
                          borderLeft: i !== 0 ? '1px solid #e6e6e6' : '',
                          width: `${
                            //@ts-ignore
                            ((record?.info?.startSec -
                              (i === 0
                                ? 0
                                : //@ts-ignore
                                  screenRecorder.recorders[i - 1]?.info
                                    ?.startSec)) /
                              userSimulation.usageTime) *
                            100
                          }%`,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Button
                          onClick={async () => {
                            //@ts-ignore
                            // setVideoIndex(i)
                            screenRecorderStore.recordId = record.info.recordId
                            screenRecorderStore
                              .checkFileExists(
                                //@ts-ignore
                                `${userSimulation._id}_${record.info.recordId}`
                              )
                              .then((res) => {
                                //@ts-ignore
                                // setIsExist(res.data)
                                screenRecorderStore.isExist = res.status === 200
                                // setIsExist(false)
                              })
                          }}
                        >
                          <PlayCircleOutlineIcon />
                          {/* <Typography
                            sx={{
                              fontSize: '12px',
                            }}
                          >
                            PLAY
                          </Typography> */}
                        </Button>
                      </Box>
                    </>
                  )
                })}
              </Box>
            </Card>
            {/* {videoIndex !== null ? ( */}
            {screenRecorderStore.recordId !== '' ? (
              <Card
                sx={{
                  width: isModal ? '700px' : '100%',
                }}
              >
                {screenRecorderStore.isExist ? (
                  <Video
                    //@ts-ignore
                    url={`https://craa-sr-data.s3.us-east-2.amazonaws.com/${userSimulation._id}_${screenRecorderStore.recordId}.webm`}
                    index={videoIndex}
                    recordId={
                      //@ts-ignore
                      screenRecorderStore.recordId
                    }
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: '500px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <HourglassTopIcon sx={{ fontSize: 50, color: '#d9d9d9' }} />
                    <Typography
                      sx={{
                        color: '#a6a6a6',
                        mt: 2,
                      }}
                    >
                      Video not ready. Please try later.
                    </Typography>
                  </Box>
                )}
              </Card>
            ) : (
              <></>
            )}
          </Stack>
        </Box>
      )}
    </>
  )
})
