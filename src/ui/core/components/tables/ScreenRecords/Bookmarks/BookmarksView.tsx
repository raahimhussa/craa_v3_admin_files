import {
  Box,
  ButtonGroup,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Switch,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from '@mui/material'
import {
  Lock,
  LockOpen,
  LockRounded,
  Edit,
  Delete,
  Save,
} from '@mui/icons-material'
import { observer, useLocalObservable } from 'mobx-react'
import Bookmark from 'src/models/bookmark'
import Button from 'src/ui/core/components/mui/inputs/Button/Button'
import IBookmark from 'src/models/bookmark/types'
import Log from 'src/models/log'
import Spacer from 'src/ui/core/components/Spacer/Spacer'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useRootStore } from 'src/stores'
import palette from 'src/theme/palette'
import DeleteDialogue from '@components/DeleteDialogue/DeleteDialogue'
const Notes = ({
  bookmarks,
  userSimulationId,
  bookmarksMutate,
  logs,
  recorders,
}: {
  bookmarks: IBookmark[]
  userSimulationId: string
  bookmarksMutate: any
  recorders: any
  logs: Log[]
}) => {
  const { uiState, bookmarkStore, screenRecorderStore, authStore } =
    useRootStore()
  const localState = useLocalObservable(() => ({
    checked: false,
  }))
  const [deleteDialogueOpen, setDeleteDialogueOpen] = useState('')

  const _bookmarks = bookmarks.filter((bookmark) => {
    if (localState.checked) {
      if (bookmark.isPrivate) {
        return true
      } else {
        return false
      }
    }
    return true
  })

  const [editBookmark, setEditBookmark] = useState<Bookmark>()
  const [bookmarkId, setBookmarkId] = useState('')

  return (
    <Box
      sx={{ height: uiState.windowDimensions.height - 200, overflow: 'auto' }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', flex: 1, mt: 2 }}>
        <TextField
          multiline
          minRows={3}
          sx={{ mr: 1 }}
          fullWidth
          onChange={(e) => {
            // bookmarkStore.bookmark.isPrivate = false
            bookmarkStore.setText(e.target.value)
          }}
          value={
            bookmarkStore.bookmark._id === undefined
              ? bookmarkStore.bookmark.text
              : ''
          }
          size="small"
        />
        <Button
          size="small"
          onClick={async () => {
            const index = recorders.findIndex(
              (record: any) =>
                record.info.recordId === screenRecorderStore.recordId
            )
            const start = index === 0 ? 0 : recorders[index - 1]?.info?.startSec
            await bookmarkStore.add(userSimulationId, start)
            bookmarkStore.bookmark.text = ''
            bookmarksMutate()
          }}
          sx={{ width: '20%' }}
          variant="contained"
          color="primary"
        >
          ADD
        </Button>
      </Box>

      <Box>
        <FormLabel>
          {bookmarkStore.bookmark.isPrivate ? 'Private' : 'Public'}
        </FormLabel>
        <Switch
          onChange={(e, checked) => {
            bookmarkStore.bookmark.isPrivate = checked
          }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <Checkbox
          value={localState.checked}
          onChange={(e, checked) => (localState.checked = checked)}
        />
        <FormLabel>Only Private</FormLabel>
      </Box>

      <TableBody className="bookmarkTable">
        {_bookmarks?.map((bookmark) => {
          if (
            (bookmark.isPrivate && bookmark.userId === authStore.user._id) ||
            !bookmark.isPrivate
          ) {
            return (
              <TableRow hover>
                <DeleteDialogue
                  open={deleteDialogueOpen === bookmark._id}
                  handleClose={() => {
                    setDeleteDialogueOpen('')
                  }}
                  onDelete={async () => {
                    await bookmarkStore.delete(bookmark._id)
                    await bookmarksMutate()
                  }}
                  title={`Are you sure you want to delete the bookmark "${bookmark.text}"?`}
                  text={
                    "This item will be deleted permanently. You can't undo this action."
                  }
                  yesText={'Delete'}
                  noText={'Cancel'}
                />
                <TableCell
                  sx={{
                    width: '80%',
                    wordBreak: 'break-all',
                    lineHeight: '1.3 !important',
                  }}
                >
                  {bookmarkStore.bookmark?._id === bookmark._id ? (
                    <TextField
                      multiline
                      value={bookmarkStore.bookmark.text}
                      className="bookmark-input"
                      onChange={(e) => {
                        bookmarkStore.setText(e.target.value)
                      }}
                    >
                      {bookmark.text}
                    </TextField>
                  ) : (
                    <>{bookmark.text}</>
                  )}
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    {moment.utc(bookmark.duration * 1000).format('HH:mm:ss')}
                    <ButtonGroup>
                      <Button
                        size="small"
                        onClick={() => {
                          setBookmarkId(bookmark._id)
                          const index = recorders.findIndex(
                            (record: any) =>
                              record.info.recordId ===
                              screenRecorderStore.recordId
                          )
                          const start =
                            index === 0
                              ? 0
                              : recorders[index - 1]?.info?.startSec
                          screenRecorderStore.recordId = bookmark.recordId
                          setTimeout(() => {
                            screenRecorderStore.play(bookmark.duration, start)
                          }, 1000)
                        }}
                        variant="outlined"
                        sx={{
                          mr: 0.5,
                          borderColor:
                            bookmarkId === bookmark._id
                              ? '#396d82 !important'
                              : 'rgb(84, 91, 100) !important',
                          borderWidth:
                            bookmarkId === bookmark._id
                              ? '2px !important'
                              : '1px !important',
                        }}
                      >
                        View
                      </Button>
                      {/* <Button
                      size="small"
                      color="error"
                      onClick={async () => {
                        await bookmarkStore.delete(bookmark._id)
                        await bookmarksMutate()
                      }}
                      variant="outlined"
                    >
                      Delete
                    </Button> */}
                    </ButtonGroup>
                  </Box>
                  {bookmark.userId === authStore.user._id ? (
                    <Box
                      sx={{
                        display: 'flex',
                      }}
                    >
                      <IconButton
                        onClick={async () => {
                          await bookmarkStore.changeStatus(
                            bookmark._id,
                            !bookmark.isPrivate
                          )
                          await bookmarksMutate()
                        }}
                      >
                        {bookmark.isPrivate ? <Lock /> : <LockOpen />}
                      </IconButton>

                      {bookmarkStore.bookmark?._id === bookmark._id ? (
                        <IconButton
                          onClick={async () => {
                            await bookmarkStore.edit(userSimulationId)
                            bookmarkStore.bookmark = {
                              text: '',
                              _id: undefined,
                              userId: '',
                              userSimulationId: '',
                              duration: 0,
                              recordId: '',
                              isDeleted: false,
                              isPrivate: false,
                            }
                            await bookmarksMutate()
                          }}
                        >
                          <Save
                            sx={{
                              color: palette.light.button.green,
                            }}
                          />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={() => {
                            bookmarkStore.bookmark = bookmark
                          }}
                        >
                          <Edit
                            sx={{
                              color: palette.light.button.yellow,
                            }}
                          />
                        </IconButton>
                      )}
                      <IconButton
                        onClick={() => {
                          setDeleteDialogueOpen(bookmark._id)
                        }}
                      >
                        <Delete
                          sx={{
                            color: palette.light.button.red,
                          }}
                        />
                      </IconButton>
                    </Box>
                  ) : (
                    <></>
                  )}
                </TableCell>
              </TableRow>
            )
          }
        })}
      </TableBody>
    </Box>
  )
}

export default observer(Notes)
