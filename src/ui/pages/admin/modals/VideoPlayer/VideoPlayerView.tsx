import { observer } from 'mobx-react'
import { Note, Spacer, Typography } from 'src/ui/core/components'
import { Box, Grid, Button, ButtonBase } from '@mui/material'
import { useEffect, useRef } from 'react'
import { useRootStore } from 'src/stores'
import _Bookmarks from '../../Bookmarks/Bookmarks'
import ToggleButtons from 'src/ui/core/components/mui/inputs/ToggleButtons/ToggleButtons'
import Footer from 'src/ui/core/components/Footer/Footer'
import { action } from 'mobx'
import moment from 'moment'
// import { VIDEOTYPES } from '../../TrainingRooms/withColumns'
import uniqid from 'uniqid'
import { useRTCViewer } from 'src/hooks/useRTCViewer'
import Timestamp from 'src/ui/core/components/cells/CellTimestamp/CellTimestamp'

function VideoPlayerView({ state, onClickClose, onClickAddBookmarkOrNote }: any) {
  const {
    // videoStore,
    modalStore } = useRootStore()
  const videoRef = useRef<HTMLVideoElement>(null)

  useRTCViewer(
    // null,
    {
      // @ts-ignore
      channelName: 'craa-kvs-202203',
      // @ts-ignore
      // region: 'ap-northeast-2',
      // @ts-ignore
      // accessKeyId: "AKIA26OVNBO7INTMJYUP",
      // @ts-ignore
      // secretAccessKey: "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",
      // // @ts-ignore
      // channelName: 'kvs-test',
      // // @ts-ignore
      region: 'us-east-2',
      // @ts-ignore
      accessKeyId: 'AKIA4UKOHVMLTBCIMEXR',
      // @ts-ignore
      secretAccessKey: '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',
    },
    videoRef
  )

  useEffect(() => {
    if (videoRef.current) {
      // videoStore.video = videoRef
      videoRef.current?.addEventListener('loadedmetadata', function () {
        if (videoRef.current?.duration == Infinity) {
          videoRef.current.currentTime = 1e101
          videoRef.current.ontimeupdate = function () {
            this.ontimeupdate = () => {
              return
            }
            if (videoRef.current) {
              videoRef.current.currentTime = 0
              return
            }
          }
        }
      })
    }
  }, [videoRef])
  const colums = [
    {
      Header: '_id',
      accessor: '_id',
    },
    {
      Header: 'Kind',
      accessor: 'kind',
    },
    {
      Header: 'Content',
      accessor: 'content',
    },
    {
      Header: 'Timestamp',
      accessor: 'timestamp',
      Cell: Timestamp,
    },
  ]

  const items = [
    {
      text: 'LOGS',
      value: 'EVENTLOG',
    },
    {
      text: 'NOTES',
      value: 'NOTE',
    },
    {
      text: 'BOOKMARKS',
      value: 'BOOKMARK',
    },
  ]

  const trainingRoom = state.trainingRoom

  const bookmarks = trainingRoom.bookmarks?.filter((bookmark: any) => bookmark.kind === 'bookmark')

  const notes = trainingRoom.bookmarks?.filter((bookmark: any) => bookmark.kind === 'note')

  const toggleButton = (
    <Box sx={{ display: 'flex', flex: 1 }}>
      <ButtonBase
        onClick={() => onClickAddBookmarkOrNote('note')}
        sx={{ flex: 1, border: 1, borderColor: 'primary.main', height: 42, borderRadius: 2 }}
      >
        ADD A NOTE
      </ButtonBase>
      <Spacer row spacing={2} />
      <ButtonBase
        onClick={() => onClickAddBookmarkOrNote('bookmark')}
        sx={{ flex: 1, border: 1, borderColor: 'primary.main', height: 42, borderRadius: 2 }}
      >
        ADD A BOOKMARK
      </ButtonBase>
    </Box>
  )

  let src = state.trainingRoom.screenRecords[0].url
  // if (modalStore.videoPlayer.type === VIDEOTYPES.MONITOR) {
  //   src = null
  // }
  return (
    <Box
      sx={{
        border: 0,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'auto',
      }}
    >
      <Note state={state} />
      <Grid container>
        <Grid item xs={12} sx={{ mt: 2 }} justifyContent="flex-end" flex={1} display="flex">
          <Button onClick={onClickClose} color="error" variant="contained">
            Close
          </Button>
        </Grid>

        <Grid item xs={12} justifyContent="center" flex={1} display="flex">
          <Box sx={{ height: 20 }}></Box>
        </Grid>
        <Grid item container xs={12} sx={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
          <Grid item container xs={9} sx={{ p: 2 }}>
            <Grid item xs={12} alignItems="center" display={'flex'} justifyContent="center">
              <video ref={videoRef} controls style={{ width: '100%', height: '100%' }} src={src} />
            </Grid>
          </Grid>

          <Grid container item xs={3} sx={{ overflow: 'auto', maxHeight: '100vh' }}>
            <Grid item xs={12}>
              <ToggleButtons items={items} state={state} path="currentButtonText" />
            </Grid>

            <Grid item xs={12}>
              <Spacer spacing={4} />
            </Grid>

            <Grid item flex={1}>
              <Box
                sx={{
                  display: state.currentButtonText === 'BOOKMARK' ? 'flex' : 'none',
                  flexDirection: 'column',
                }}
              >
                {toggleButton}
                <SimpleDataGrid data={bookmarks} />
              </Box>
              <Box sx={{ display: state.currentButtonText === 'EVENTLOG' ? 'block' : 'none' }}>
                <SimpleDataGrid data={trainingRoom.eventLogs} />
              </Box>
              <Box
                sx={{
                  display: state.currentButtonText === 'NOTE' ? 'flex' : 'none',
                  flexDirection: 'column',
                  flex: 1,
                }}
              >
                {toggleButton}
                <SimpleDataGrid data={notes} />
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Spacer spacing={2} />
      </Grid>
      <Footer light />
    </Box>
  )
}
export default observer(VideoPlayerView)

const SimpleDataGrid = observer(({ data }: any) => {
  const renderRow = (item: any, index: number) => {
    const isEven = (index + 1) % 2 === 0

    let sx: any = {
      flex: '1 1 52px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      px: 1,
    }
    if (isEven) {
      sx = {
        bgcolor: '#E5E5E5',
        ...sx,
      }
    }
    // const { videoStore } = useRootStore()

    const onClick = (item: any) => {
      // if (videoStore.video && videoStore.video.current && item.timestamp) {
      //   videoStore.video.current.currentTime = item.timestamp
      //   videoStore.video.current.play()
      // }
    }

    return (
      <Box key={uniqid()} sx={sx}>
        <Typography variant="body2">
          {index}. {item.content}
        </Typography>
        <Typography variant="body2">
          <Button variant="text" sx={{ color: 'black' }} onClick={action(() => onClick(item))}>
            {moment.utc(item.timestamp * 1000).format('HH:mm:ss')}
          </Button>
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ flex: 1, flexDirection: 'column', display: 'flex', mt: 2 }}>
      {data?.map(renderRow)}
    </Box>
  )
})
