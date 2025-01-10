import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { observer } from 'mobx-react'
import React from 'react'
import { useRTCMaster } from 'src/hooks/useRTCMaster'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

const VideoJS = (props: any) => {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const playerRef: any = React.useRef(null)
  const { options, onReady } = props

  React.useEffect(() => {
    // make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current
      if (!videoElement) return

      const player = (playerRef.current = videojs(videoElement, options, () => {
        onReady && onReady(player)
      }))
    } else {
      // you can update player here [update player through props]
      // const player = playerRef.current;
      // player.autoplay(options.autoplay);
      // player.src(options.sources);
    }
  }, [options, videoRef])

  // Dispose the Video.js player when the functional component unmounts
  React.useEffect(() => {
    const player: any = playerRef.current

    return () => {
      if (player) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [playerRef])

  const onClick = () => {
    console.log(videoRef.current?.currentTime)
  }

  return (
    <Box>
      <Button onClick={onClick} variant="contained">
        Bookmarks
      </Button>
      <video ref={videoRef} />
    </Box>
  )
}

export default observer(VideoJS)
