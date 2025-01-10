import {
  Add,
  CancelRounded,
  Close,
  Delete,
  Edit,
  Save,
} from '@mui/icons-material'
import { Box, Button, Divider, TextField, Typography } from '@mui/material'
import { observer } from 'mobx-react'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import DocumentVariableGroup from 'src/models/documentVariableGroup'
import { useRootStore } from 'src/stores'
import palette from 'src/theme/palette'
import DeleteDialogue from '@components/DeleteDialogue/DeleteDialogue'

function Group() {
  const {
    documentVariableGroupStore,
    uiState: { modal },
    documentVariableStore,
  } = useRootStore()
  const { enqueueSnackbar } = useSnackbar()
  const [groups, setGroups] = useState<DocumentVariableGroup[]>([])
  const [isAdd, setIsAdd] = useState(false)
  const [edit, setEdit] = useState('')
  const [deleteDialogueOpen, setDeleteDialogueOpen] = useState<boolean>(false)

  const getGroups = async () => {
    const { data } =
      await documentVariableGroupStore.documentVariableGroupRepository.find({
        filter: {
          isDeleted: false,
        },
      })
    setGroups(data)
  }

  useEffect(() => {
    getGroups()
  }, [])

  const onClickSave = async () => {
    try {
      const data = await documentVariableGroupStore.create()
      if (data) {
        enqueueSnackbar('Group added.', {
          variant: 'success',
        })
        getGroups()
      } else {
        enqueueSnackbar('Please try again later.', {
          variant: 'error',
        })
      }
      //   modal.close()
      setIsAdd(false)
    } catch (error) {
      console.log(error)
    }
  }
  const onClickEdit = async () => {
    try {
      const data = await documentVariableGroupStore.update(
        documentVariableGroupStore.form._id,
        {
          name: documentVariableGroupStore.form.name,
          updatedAt: new Date(),
        }
      )
      if (data?.status === 200) {
        enqueueSnackbar('Group edited.', {
          variant: 'success',
        })
        setEdit('')
        getGroups()
      } else {
        enqueueSnackbar('Please try again later.', {
          variant: 'error',
        })
      }
      //   modal.close()
      setIsAdd(false)
    } catch (error) {
      console.log(error)
    }
  }
  const onClickDelete = async (groupId: any) => {
    try {
      const { data } =
        await documentVariableStore.documentVariableRepository.find({
          filter: {
            isDeleted: false,
          },
        })
      console.log(data)
      data.map(async (variable: any) => {
        if (variable.groupId === groupId) {
          await documentVariableStore.delete(variable._id)
        }
      })
      await documentVariableGroupStore.delete(groupId)
      getGroups()
      //   modal.close()
      // setIsAdd(false)
    } catch (error) {
      console.log(error)
      enqueueSnackbar('Please try again later.', {
        variant: 'error',
      })
    }
  }

  return (
    <Box
      sx={{
        width: '500px',
        //   height: '300px',
        bgcolor: 'white',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        position: 'relative',
        mt: '25vh',
        mx: 'auto',
        height: '50vh',
        maxHeight: '50vh',
      }}
    >
      <Typography
        sx={{
          fontWeight: 600,
          color: palette.light.button.dark,
          mb: 2,
        }}
      >
        Groups
      </Typography>
      <Box
        sx={{
          position: 'absolute',
          right: 1,
          top: 2,
          m: 1,
        }}
      >
        <Button
          sx={{
            minWidth: '10px !important',
            mr: 1,
          }}
          onClick={() => {
            setIsAdd(true)
          }}
          variant="contained"
        >
          New
        </Button>
        <Button
          sx={{
            minWidth: '10px !important',
            bgcolor: palette.light.button.red,
          }}
          onClick={() => {
            modal.close()
          }}
          variant="contained"
        >
          Close
        </Button>
      </Box>
      {!isAdd ? (
        <Box
          sx={{
            height: 'calc(100% - 25px)',
            overflowY: 'auto',
            // pr: 1,
          }}
        >
          {groups.map((group: DocumentVariableGroup) => (
            <Box
              sx={{
                width: '100%',
                borderRadius: '8px',
                bgcolor: 'rgb(242, 242, 242,0.5)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 1,
                py: 1.5,
                pl: 1.5,
                mb: 1,
              }}
            >
              {edit === group._id ? (
                <TextField
                  className="title"
                  sx={{
                    width: '99%',
                    height: '40px',
                  }}
                  value={documentVariableGroupStore.form.name}
                  onChange={(e) => {
                    documentVariableGroupStore.form.name = e.target.value
                  }}
                >
                  {group.name}
                </TextField>
              ) : (
                <Typography
                  sx={{
                    fontSize: '0.8rem',
                  }}
                >
                  {group.name}
                </Typography>
              )}
              <Box>
                {edit === group._id ? (
                  <Button
                    sx={{
                      minWidth: '10px !important',
                    }}
                    onClick={onClickEdit}
                  >
                    <Save
                      sx={{
                        color: palette.light.button.green,
                      }}
                    />
                  </Button>
                ) : (
                  <Button
                    sx={{
                      minWidth: '10px !important',
                    }}
                    onClick={() => {
                      documentVariableGroupStore.form = group
                      setEdit(group._id)
                    }}
                  >
                    <Edit
                      sx={{
                        color: palette.light.button.yellow,
                      }}
                    />
                  </Button>
                )}
                <Button
                  sx={{
                    minWidth: '10px !important',
                  }}
                  onClick={() => {
                    setDeleteDialogueOpen(true)
                  }}
                >
                  <Delete
                    sx={{
                      color: palette.light.button.red,
                    }}
                  />
                </Button>
                <DeleteDialogue
                  open={deleteDialogueOpen}
                  handleClose={() => {
                    setDeleteDialogueOpen(false)
                  }}
                  onDelete={() => {
                    onClickDelete(group._id)
                  }}
                  title={`Are you sure you want to delete the group?`}
                  text={
                    "All the variables under the group will be deleted. You can't undo this action."
                  }
                  yesText={'Delete'}
                  noText={'Cancel'}
                />
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <>
          <TextField
            className="title"
            value={documentVariableGroupStore.form.name}
            fullWidth
            onChange={(e) => {
              documentVariableGroupStore.form.name = e.target.value
            }}
            label="Name"
          />
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              justifyContent: 'flex-end',
              mt: 2,
            }}
          >
            <Button
              sx={{
                mr: 1,
              }}
              onClick={() => {
                setIsAdd(false)
              }}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={onClickSave}>
              Add
            </Button>
          </Box>
        </>
      )}
    </Box>
    // </Box>
  )
}

export default observer(Group)
