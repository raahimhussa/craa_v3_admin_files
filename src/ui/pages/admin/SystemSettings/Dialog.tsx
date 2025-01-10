import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from '@mui/material'
import axios from 'axios'
import { observer } from 'mobx-react'
import { useSnackbar } from 'notistack'
import { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'

function DialogView(props: any) {
  const { setTutorialType, tutorialType } = props
  const reactPlayerRef = useRef<ReactPlayer>(null)
  const [url, setUrl] = useState<any>(undefined)
  const [isValidVideo, setIsValidVideo] = useState<any>(false)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    getUrl()
  }, [])

  const getUrl = async () => {
    const params = {
      filter: {
        type: tutorialType,
      },
    }
    const { data } = await axios.get('/v2/tutorials', { params })
    console.log(params)
    console.log(data)
    setUrl(data.url)
  }

  const saveUrl = async () => {
    const params = {
      filter: {
        type: tutorialType,
      },
      update: {
        url: url,
      },
    }
    console.log(params)
    await axios.patch('/v2/tutorials', {
      filter: {
        type: tutorialType,
      },
      update: {
        url: url,
      },
    })
  }

  useEffect(() => {
    console.log(reactPlayerRef)
  }, [reactPlayerRef])

  return (
    <Dialog
      onClose={() => {
        setTutorialType('')
      }}
      open={true}
      sx={{
        '&.MuiPaper-root': { maxWidth: '1000px !important' },
      }}
    >
      <DialogTitle>Tutorial Setting</DialogTitle>
      <DialogContent sx={{ width: '600px' }}>
        <InputLabel
          sx={{
            mt: 2,
            mb: 1,
          }}
        >
          URL
        </InputLabel>
        <TextField
          value={url}
          onChange={(e) => {
            setIsValidVideo(false)
            setUrl(e.target.value)
          }}
          placeholder="vimeo.com/*********"
          fullWidth
          sx={{
            mb: 1,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ ml: 1 }}>
                https://
              </InputAdornment>
            ),
          }}
        />
        <ReactPlayer
          ref={reactPlayerRef}
          // url={'https://vimeo.com/768821186'}
          url={`https://${url}`}
          controls
          width="100%"
          //   height="100%"
          style={{}}
          onReady={() => {
            setIsValidVideo(true)
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setTutorialType('')
          }}
        >
          Close
        </Button>
        <Button
          onClick={async () => {
            try {
              await saveUrl()
              setTutorialType('')
              enqueueSnackbar('Url saved.', {
                variant: 'success',
              })
            } catch (error) {
              enqueueSnackbar('Please try later.', {
                variant: 'error',
              })
            }
          }}
          autoFocus
          variant="contained"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
export default observer(DialogView)
