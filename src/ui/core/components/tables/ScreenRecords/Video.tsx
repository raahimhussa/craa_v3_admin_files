import { useEffect, useRef, useState } from 'react'
import { useRootStore } from 'src/stores'
import { Grid, LinearProgress, Paper, Tab, Tabs } from '@mui/material'

function MyComponent(props: any) {
  const { screenRecorderStore } = useRootStore()
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    screenRecorderStore.videoIndex = props.index
    // screenRecorderStore.recordId = props.recordId
    screenRecorderStore.duration = props.start
  }, [])
  useEffect(() => {
    if (videoRef.current) {
      screenRecorderStore.video = videoRef.current
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

  return (
    <Paper sx={{ p: 2 }}>
      <video
        width={'100%'}
        ref={videoRef}
        controls
        src={props.url}
        itemType="video/webm"
        playsInline
      ></video>
    </Paper>
  )
}

export default MyComponent
