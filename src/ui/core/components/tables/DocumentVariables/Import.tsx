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
import { ReactSpreadsheetImport } from 'react-spreadsheet-import'

function Import() {
  const {
    documentVariableStore,
    documentVariableGroupStore,
    uiState: { modal },
  } = useRootStore()
  const { enqueueSnackbar } = useSnackbar()
  const [groupId, setGroupId] = useState<string>('')
  const [groups, setGroups] = useState<DocumentVariableGroup[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const fields = [
    {
      // Visible in table header and when matching columns.
      label: 'Key',
      key: 'key',
      // Used when editing and validating information.
      fieldType: {
        // There are 3 types - "input" / "checkbox" / "select".
        type: 'input',
      },
    },
    {
      // Visible in table header and when matching columns.
      label: 'Value',
      key: 'Value',
      // Used when editing and validating information.
      fieldType: {
        // There are 3 types - "input" / "checkbox" / "select".
        type: 'input',
      },
    },
  ]

  const onSubmit = async (data: any) => {
    try {
      const variables = data.validData
      variables.map(async (variable: any) => {
        documentVariableStore.form.groupId = groupId
        documentVariableStore.form.key = variable.key
        documentVariableStore.form.value = variable.Value
        console.log(documentVariableStore.form)
        const newData = await documentVariableStore.create()
        documentVariableStore.resetForm()
      })
      modal.close()
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
    <>
      <ReactSpreadsheetImport
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
        }}
        onSubmit={(data) => {
          onSubmit(data)
        }}
        //@ts-ignore
        fields={fields}
      />
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
            Select group
          </Typography>
          <Box
            sx={{
              width: '100%',
              position: 'relative',
              mb: 1,
            }}
          >
            <Select
              sx={{
                height: '45px',
                width: '100%',
              }}
              className="versionSelect"
              value={groupId}
              onChange={(e: any) => {
                setGroupId(e.target.value)
              }}
            >
              {groups.map((group) => (
                <MenuItem value={group._id}>{group.name}</MenuItem>
              ))}
            </Select>
          </Box>
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
            <Button
              variant="contained"
              onClick={() => {
                setIsOpen(true)
              }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default observer(Import)
