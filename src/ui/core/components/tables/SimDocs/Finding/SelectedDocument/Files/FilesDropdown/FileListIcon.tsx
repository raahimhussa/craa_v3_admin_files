import {
  Article,
  DeleteOutline,
  Folder,
  PictureAsPdf,
  VisibilityOutlined,
} from '@mui/icons-material'
import { Box, Button, Divider, Tooltip } from '@mui/material'

import DeleteDialogue from './DeleteDialogue/DeleteDialogue'
import File from 'src/models/file'
import { FileContextMenu } from './FileContextMenu'
import PDFViewer from '@components/tables/SimDocs/Finding/SelectedDocument/PDFViewer/PDFViewer'
import { Utils } from '@utils'
import axios from 'axios'
import { useRootStore } from 'src/stores'
import { useState } from 'react'

import moment from 'moment'

type Props = {
  file: File
  mutate: any
  onClose: () => void
}

export const FileListIcon = ({ file, mutate, onClose }: Props) => {
  const {
    uiState: { modal },
    simDocStore,
    findingStore,
  } = useRootStore()
  const [openContextMenu, setOpenContextMenu] = useState<boolean>(false)
  const [menuPosition, setMenuPosition] = useState<{
    top: number
    left: number
  }>({ top: 0, left: 0 })
  const [openDeleteDialogue, setOpenDeleteDialogue] = useState<boolean>(false)

  const onClickSelect = async () => {
    const simDocId = findingStore.selectedSimDoc?._id
    const selectedSimDocMutate = findingStore.selectedSimDocMutate
    await simDocStore.update(simDocId, { files: [file] })
    selectedSimDocMutate && (await selectedSimDocMutate())
    onClose()
  }

  const onClickRemove = async (e: any) => {
    e.stopPropagation()
    setOpenDeleteDialogue(true)
  }
  const onHandlePreview = (e: any) => {
    e.stopPropagation()
    modal.open('ViewFile', <PDFViewer fileUrl={file.url} />)
  }
  const onHandleRemove = async () => {
    await axios.delete('v1/files', {
      params: {
        filter: {
          _id: file._id,
        },
      },
    })
    mutate && (await mutate())
  }

  const getFileSize = () => {
    let convertedFileSize = ''
    if (Utils.bytesToKiloBytes(file.size || 0) > 1023) {
      convertedFileSize =
        Utils.bytesToMegaBytes(file.size || 0).toFixed(1) + ' MB'
    } else {
      convertedFileSize =
        Utils.bytesToKiloBytes(file.size || 0).toFixed(0) + ' KB'
    }
    return convertedFileSize
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          margin: '8px',
          padding: '8px 0px',
          backgroundColor: openContextMenu ? 'rgba(24,90,255,0.1)' : 'white',
          '&:hover': {
            backgroundColor: 'rgba(24,255,90,0.1)',
          },
          cursor: 'pointer',
        }}
        onClick={onClickSelect}
        onContextMenu={(e) => {
          e.preventDefault() // prevent the default behaviour when right clicked
          setOpenContextMenu(true)
          setMenuPosition({ top: e.pageY, left: e.pageX })
        }}
      >
        <Box sx={{ display: 'flex', width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: 56,
            }}
          >
            <FileMiniIcon mimeType={file.mimeType} />
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flex: 1,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {file.name}
          </Box>
          <Box sx={{ width: 16 }} />
          <Box sx={{ width: 16, borderLeft: '1px solid grey' }} />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: 50,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {getFileSize()}
          </Box>
          <Box sx={{ width: 16 }} />
          <Box sx={{ width: 16, borderLeft: '1px solid grey' }} />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: 150,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {moment(file.updatedAt).format('DD-MMM-YYYY hh:mm:ss')}
          </Box>           
          <Box sx={{ width: 16 }} />
          <Box sx={{ width: 16, borderLeft: '1px solid grey' }} />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: 96,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <Button sx={{ minWidth: 0 }} onClick={onHandlePreview}>
              <VisibilityOutlined />
            </Button>
            <Button sx={{ minWidth: 0 }} onClick={onClickRemove}>
              <DeleteOutline />
            </Button>
          </Box>
        </Box>
      </Box>
      <Divider />
      <FileContextMenu
        file={file}
        open={openContextMenu}
        onClose={() => setOpenContextMenu(false)}
        top={menuPosition.top}
        left={menuPosition.left}
        mutate={mutate}
      />
      <DeleteDialogue
        open={openDeleteDialogue}
        handleClose={() => setOpenDeleteDialogue(false)}
        onDelete={onHandleRemove}
        title={`Are you sure you want to delete "${file.name}"?`}
        text={
          "This item will be deleted permanently. You can't undo this action."
        }
        yesText={'Delete'}
        noText={'Cancel'}
      />
    </>
  )
}

export const FileMiniIcon = ({ mimeType }: { mimeType: string }) => {
  if (mimeType === 'application/pdf') {
    return <PictureAsPdf color="error" />
  }
  return <Article />
}
