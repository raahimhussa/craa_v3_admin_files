import { Divider, Typography } from '@mui/material'
import { observer, useLocalObservable } from 'mobx-react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import File from 'src/models/file'
import Files from 'src/ui/core/components/tables/Files/Files'
import PaginationTable from 'src/ui/components/PaginationTable'
import SimDoc from 'src/models/simDoc'
import { useRootStore } from 'src/stores'

type Props = {
  files: File[]
  simDocId: string
  simDocMutate: any
}

function FileSelectView(props: Props) {
  const { files, simDocId, simDocMutate } = props

  const {
    uiState: { modal },
    simDocStore,
  } = useRootStore()
  const localState = useLocalObservable(() => ({
    selectedRowIds: [],
  }))

  const onClickSelect = async () => {
    const filesByFilteredById = files.filter((file: any) =>
      // @ts-ignore
      localState.selectedRowIds.includes(file._id)
    )
    await simDocStore.update(simDocId, { files: filesByFilteredById })
    simDocMutate && simDocMutate()
    modal.close()
  }

  const onClickCancel = async () => {
    modal.close()
  }

  return (
    <Box sx={{ display: 'flex', bgcolor: 'white' }}>
      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            position: 'absolute',
            display: 'flex',
            zIndex: 200,
            top: 16,
            right: 20,
          }}
        >
          <Box sx={{ flex: 1 }} />
          <Button
            variant="contained"
            fullWidth
            onClick={onClickSelect}
            sx={{ width: 96 }}
          >
            Select
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={onClickCancel}
            sx={{ ml: 1, width: 96 }}
          >
            Cancel
          </Button>
        </Box>
        <Box sx={{ height: 900, overflow: 'auto' }}>
          <PaginationTable
            collectionName={'files'}
            Table={Files}
            version={1}
            params={{
              filter: { mimeType: 'application/pdf', isDeleted: false },
            }}
            buttons={false}
            state={localState}
          />
        </Box>
      </Box>
    </Box>
  )
}
export default observer(FileSelectView)
