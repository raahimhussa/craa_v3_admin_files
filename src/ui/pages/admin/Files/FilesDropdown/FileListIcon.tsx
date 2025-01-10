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

import {
  AdminLogManager,
  AdminLogTargetType,
} from 'src/classes/adminLogManager'
import { AdminLogScreen } from 'src/utils/status'

import { useUser } from '@hooks'

type Props = {
  file: File
  mutate: any
}

export const FileListIcon = ({ file, mutate }: Props) => {
  const {
    uiState: { modal },
  } = useRootStore()
  const [openContextMenu, setOpenContextMenu] = useState<boolean>(false)
  const [menuPosition, setMenuPosition] = useState<{
    top: number
    left: number
  }>({ top: 0, left: 0 })
  const [openDeleteDialogue, setOpenDeleteDialogue] = useState<boolean>(false)

  const { data: user } = useUser()
  const adminLogManager = AdminLogManager.getInstance();

  const onClickRemove = async (e: any) => {
    e.stopPropagation()
    setOpenDeleteDialogue(true)
  }
  const onHandlePreview = (e: any) => {
    e.stopPropagation()
    modal.open('ViewFile', <PDFViewer fileUrl={file.url} />)
  }
  const onHandleRemove = async () => {
    const _pdfFileDeleted = await axios.delete('v1/files', {
      params: {
        filter: {
          _id: file._id,
        },
      },
    })
    mutate && (await mutate())

    // console.log("FileListIcon::onHandleRemove: ", _pdfFileDeleted)

    if(_pdfFileDeleted?.data?.deletedCount === 1 && _pdfFileDeleted?.request?.status === 200) {
    
      adminLogManager?.createDeleteLog({
        screen: AdminLogScreen.PDFFiles,
        target: {
          type: AdminLogTargetType.PDFFiles,          
          _id: file._id || null,
          origin: file.name || '',
          path: file.path || '',
          message: 'PDF files deleted',
          _key: 'dfi'
        },
        resource: {
          // ...this.form,
        },
      })  
    }    
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
            backgroundColor: openContextMenu
              ? 'rgba(24,90,255,0.1)'
              : 'rgba(0,0,0,0.07)',
          },
        }}
        onDoubleClick={() => {
          modal.open('ViewFile', <PDFViewer fileUrl={file.url} />)
        }}
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
              width: 60,
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
