import { Button, TextareaAutosize } from 'src/ui/core/components'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Paper from '@mui/material/Paper'
import { Alert } from '@utils'
import { observer, useLocalObservable } from 'mobx-react'
import { useRootStore } from 'src/stores'
import { NoteViewProps } from './Note'

function NoteView({ state }: NoteViewProps) {
  // const { bookmarkRepository, trainingRoomRepository } = useRootStore()
  // const localState = useLocalObservable(() => ({
  //   note: {
  //     text: 'typing..',
  //     timestamp: 0,
  //   },
  // }))
  const onClickCancel = () => {
    state.note.open = false
  }

  const onClickOk = async () => {
    const bookmark = {
      kind: state.note.kind,
      content: state.note.content,
      // timestamp: videoStore.video?.current?.currentTime
    }

    // const res = await bookmarkRepository.create(bookmark)
    // await trainingRoomRepository.update({
    //   filter: { _id: state.trainingRoom._id },
    //   update: { $push: { bookmarks: res.data } }
    // })
    // state.trainingRoom.bookmarks?.push(res.data)
    // state.note.open = false
    // videoStore.video?.current?.play()
  }
  return (
    <>
      <Modal
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        open={state.note.open}
      >
        <Paper
          sx={{
            bgcolor: '#EFEFEF',
            height: 340,
            width: 630,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            px: 2,
          }}
        >
          <TextareaAutosize state={state} path="note.content" />
          <Box sx={{ display: 'flex', flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Box>
              <Button
                sx={{ ml: 2 }}
                fullWidth={false}
                variant="text"
                color="primary"
              >
                Delete
              </Button>
            </Box>
            <Box>
              <Button onClick={onClickOk} sx={{ ml: 2 }} fullWidth={false} variant="text">
                OK
              </Button>{' '}
              <Button
                onClick={onClickCancel}
                sx={{ ml: 2 }} fullWidth={false} variant="text">
                CANCEL
              </Button>
            </Box>
          </Box>
        </Paper>
      </Modal>
    </>
  )
}

export default observer(NoteView)