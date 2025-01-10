import {
  Box,
  Button,
  Divider,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { observer } from 'mobx-react'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import DocumentVariableGroup from 'src/models/documentVariableGroup'
import { useRootStore } from 'src/stores'
import palette from 'src/theme/palette'

function Variable() {
  const {
    documentVariableStore,
    documentVariableGroupStore,
    uiState: { modal },
  } = useRootStore()
  const { enqueueSnackbar } = useSnackbar()
  const [groups, setGroups] = useState<DocumentVariableGroup[]>([])

  const onClickSave = async () => {
    try {
      if (documentVariableStore.form._id) {
        const res: any = await documentVariableStore.edit()
        if (res?.data?.matchedCount === 1) {
          enqueueSnackbar('Variable edited.', {
            variant: 'success',
          })
        } else {
          enqueueSnackbar('Please try again later.', {
            variant: 'error',
          })
        }
        modal.close()
      } else {
        const data = await documentVariableStore.create()
        if (data) {
          enqueueSnackbar('Variable added.', {
            variant: 'success',
          })
        } else {
          enqueueSnackbar('Please try again later.', {
            variant: 'error',
          })
        }
        modal.close()
      }
      documentVariableStore.mutate()
    } catch (error) {
      console.log(error)
    }
  }

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

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: '500px',
          //   height: '300px',
          bgcolor: 'white',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          p: 2,
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            color: palette.light.button.dark,
            mb: 2,
          }}
        >
          {documentVariableStore.form._id ? 'Edit' : 'New'} Variable
        </Typography>
        <Box
          sx={{
            width: '100%',
            position: 'relative',
            mb: 1,
          }}
        >
          <Typography
            sx={{
              position: 'absolute',
              zIndex: 5,
              left: '10px',
              top: -8,
              fontSize: 11.3,
              fontWeight: 500,
              bgcolor: 'white',
              px: 0.3,
            }}
          >
            Group
          </Typography>
          <Select
            sx={{
              height: '45px',
              width: '100%',
            }}
            className="versionSelect"
            value={documentVariableStore.form.groupId}
            onChange={(e: any) => {
              documentVariableStore.form.groupId = e.target.value
            }}
          >
            {groups.map((group) => (
              <MenuItem value={group._id}>{group.name}</MenuItem>
            ))}
          </Select>
        </Box>
        <TextField
          className="title"
          value={documentVariableStore.form?.key}
          fullWidth
          onChange={(e) => {
            documentVariableStore.form.key = e.target.value
          }}
          label="Key"
          sx={{
            mb: 1,
          }}
        />
        <TextField
          className="title"
          value={documentVariableStore.form?.value}
          fullWidth
          onChange={(e) => {
            documentVariableStore.form.value = e.target.value
          }}
          label="Value"
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
              modal.close()
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={onClickSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default observer(Variable)
