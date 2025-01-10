import { Box, Button, Dialog, Divider, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

import File from 'src/models/file'
import FileSelect from '@components/FileSelect/FileSelect'
import Files from './Files/Files'
import PDFViewer from './PDFViewer/PDFViewer'
import SimDoc from 'src/models/simDoc'
import _ from 'lodash'
import compose from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
import { withFind } from '@hocs'
import withFindOne from 'src/hocs/withFindOne'

type Props = {
  simDocId: string
  simDoc: SimDoc[]
  simDocMutate: any
  files: File[]
}

function FindingsView({ simDocId, simDoc, simDocMutate, files }: Props) {
  const {
    uiState: { modal },
    findingStore,
  } = useRootStore()
  const [open, setOpen] = useState<boolean>(false)

  const file = simDoc?.[0]?.files?.length > 0 ? files[0] : null

  const onClickView = () => {
    if (!file) return
    modal.open('ViewFile', <PDFViewer fileUrl={file.url} />)
  }
  const onClickSelect = () => {
    findingStore.selectedSimDocMutate = simDocMutate
    setOpen(true)
  }

  const onCloseDialogue = () => {
    findingStore.selectedSimDocMutate = null
    setOpen(false)
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
          <Button
            sx={{ marginRight: '12px' }}
            disabled={!file}
            onClick={onClickView}
            variant="contained"
          >
            View PDF
          </Button>
          <Button onClick={onClickSelect} variant="contained">
            Select PDF
          </Button>
        </Box>
      </Box>
      <Box>
        <Box>
          <Typography sx={{ fontSize: '11px', color: 'gray' }}>Name</Typography>
          <Typography>{file?.name ? file?.name : '-'}</Typography>
          <Divider />
        </Box>
        <Box>
          <Typography sx={{ fontSize: '11px', color: 'gray' }}>Type</Typography>
          <Typography>{file?.mimeType ? file?.mimeType : '-'}</Typography>
          <Divider />
        </Box>
        <Box>
          <Typography sx={{ fontSize: '11px', color: 'gray' }}>Size</Typography>
          <Typography>{file?.size ? file?.size : '-'}</Typography>
          <Divider />
        </Box>
      </Box>
      <Dialog
        open={open}
        onClose={onCloseDialogue}
        fullWidth={true}
        maxWidth={'lg'}
      >
        <Files onClose={onCloseDialogue} />
      </Dialog>
    </Box>
  )
}
export default compose<any>(
  withFind({
    collectionName: 'files',
    getFilter: (props: any) => {
      if (props.simDoc.length > 0) {
        const file =
          props.simDoc?.[0]?.files?.length > 0 ? props.simDoc[0].files[0] : null
        return {
          _id: file?._id,
          isDeleted: false,
        }
      }
      return {
        _id: null,
        isDeleted: false,
      }
    },
  })
)(observer(FindingsView))
