import { Box, Button, Divider, Typography } from '@mui/material'

import File from 'src/models/file'
import SimDoc from 'src/models/simDoc'
import { TextField } from '@components'
import _ from 'lodash'
import compose from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'
import withFindOne from 'src/hocs/withFindOne'

type Props = {}

function RescueMedicationView({}: Props) {
  const {
    findingStore,
    simDocStore,
    uiState: { modal },
  } = useRootStore()
  const { enqueueSnackbar } = useSnackbar()

  const onClickSave = async () => {
    if (!findingStore.selectedSimDoc) return
    const simDocId = findingStore.selectedSimDoc._id
    const update = { ...findingStore.selectedSimDoc, store: undefined }
    try {
      await simDocStore.update(simDocId, update)
      enqueueSnackbar('saved', { variant: 'success' })
    } catch (e) {
      enqueueSnackbar('error', { variant: 'error' })
      console.error(e)
    }
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        <Box />
        <Box>
          <Button onClick={onClickSave} variant="contained">
            Save
          </Button>
        </Box>
      </Box>
      <Box>
        <Typography sx={{ fontSize: '11px', color: 'gray' }}>
          Number of pills to show:
        </Typography>
        <TextField
          label={'Number of pills to show'}
          type="number"
          value={findingStore.selectedSimDoc?.numberOfPillsToShow}
          state={findingStore}
          path={'selectedSimDoc.numberOfPillsToShow'}
          sx={{ maxWidth: '400px' }}
        />
      </Box>
      <Box>
        <Typography sx={{ fontSize: '11px', color: 'gray' }}>
          Number of pills taken by subject:
        </Typography>
        <TextField
          label={'Number of pills taken by subject'}
          type="number"
          value={findingStore.selectedSimDoc?.numberOfPillsTakenBySubject}
          state={findingStore}
          path={'selectedSimDoc.numberOfPillsTakenBySubject'}
          sx={{ maxWidth: '400px' }}
        />
      </Box>
    </Box>
  )
}
export default compose<any>()(observer(RescueMedicationView))
