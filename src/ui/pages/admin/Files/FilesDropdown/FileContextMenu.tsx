import { Box, Divider, MenuItem } from '@mui/material'
import {
  DeleteOutline,
  Download,
  DriveFileRenameOutline,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from '@mui/icons-material'
import { useEffect, useRef, useState } from 'react'

import DeleteDialogue from './DeleteDialogue/DeleteDialogue'
import File from 'src/models/file'
import PDFViewer from '@components/tables/SimDocs/Finding/SelectedDocument/PDFViewer/PDFViewer'
import UpdateDialogue from './UpdateDialogue/UpdateDialogue'
import axios from 'axios'
import { useRootStore } from 'src/stores'

import {
  AdminLogManager,
  AdminLogTargetType,
} from 'src/classes/adminLogManager'
import { AdminLogScreen } from 'src/utils/status'

import { useUser } from '@hooks'

type Props = {
  mutate: any
  file: File
  open: boolean
  onClose: () => void
  top: number
  left: number
}

export const FileContextMenu = ({
  mutate,
  file,
  open,
  onClose,
  top,
  left,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null)
  const {
    uiState: { modal },
  } = useRootStore()
  const [openUpdateDialogue, setOpenUpdateDialogue] = useState<boolean>(false)
  const [openDeleteDialogue, setOpenDeleteDialogue] = useState<boolean>(false)
  const [renameText, setRenameText] = useState<string>(file.name)

  const { data: user } = useUser()
  const adminLogManager = AdminLogManager.getInstance();

  useEffect(() => {
    const closeMenu = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', closeMenu)
    return () => {
      document.removeEventListener('mousedown', closeMenu)
    }
  }, [])

  useEffect(() => {
    if (open) return
    setRenameText(file.name)
  }, [open])

  const onClickPreview = () => {
    onHandlePreview()
    onClose()
  }
  const onClickRename = async () => {
    setOpenUpdateDialogue(true)
    onClose()
  }
  const onClickDownload = () => {
    onHandleDownload()
    onClose()
  }
  const onClickRemove = async () => {
    setOpenDeleteDialogue(true)
    onClose()
  }
  const onHandlePreview = () => {
    modal.open('ViewFile', <PDFViewer fileUrl={file.url} />)
  }
  const onHandleRename = async () => {
    const _pdfFileRenamed = await axios.patch('v3/pdfFileManagement/rename', {
      id: file._id,
      changedName: renameText,
      type: 'file',
    })
    // await axios.patch('v1/files', {
    //   filter: {
    //     _id: file._id,
    //   },
    //   update: {
    //     name: renameText,
    //   },
    // })
    mutate && (await mutate())

    if(_pdfFileRenamed?.data && _pdfFileRenamed?.request?.status === 200) {
    
      adminLogManager?.createEditLog({
        screen: AdminLogScreen.PDFFiles,
        target: {
          type: AdminLogTargetType.PDFFiles,          
          _id: file._id || null,
          origin: file.name || '',
          new: renameText || '',
          path: file.path || '',
          message: 'PDF file renamed',
          _key: 'rfi'
        },
        resource: {
          // ...this.form,
        },
      })
      
    } 

  }
  const onHandleDownload = () => {
    fetch(file.url).then((response) => {
      response.blob().then((blob) => {
        let url = window.URL.createObjectURL(blob)
        let a = document.createElement('a')
        a.href = url
        a.download = file.name
        a.click()
      })
    })
  }
  const onHandleRemove = async () => {
    const _pdfFileRemoved = await axios.delete('v1/files', {
      params: {
        filter: {
          _id: file._id,
        },
      },
    })
    mutate && (await mutate())

    if(_pdfFileRemoved?.data?.deletedCount === 1 && _pdfFileRemoved?.request?.status === 200) {
    
      adminLogManager?.createDeleteLog({
        screen: AdminLogScreen.PDFFiles,
        target: {
          type: AdminLogTargetType.PDFFiles,          
          _id: file._id || null,
          origin: file.name || '',
          path: file.path || '',
          message: 'PDF file deleted',
          _key: 'dfi'
        },
        resource: {
          // ...this.form,
        },
      })  
    } 

  }

  if (!open)
    return (
      <>
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
        <UpdateDialogue
          open={openUpdateDialogue}
          handleClose={() => setOpenUpdateDialogue(false)}
          onUpdate={onHandleRename}
          title={`Are you sure you want to rename "${file.name}"?`}
          text={''}
          unit={'name'}
          value={renameText}
          onChangeText={setRenameText}
          yesText={'Rename'}
          noText={'Cancel'}
        />
      </>
    )

  return (
    <Box
      ref={ref}
      sx={{
        position: 'fixed',
        top,
        left,
        backgroundColor: 'white',
        boxShadow: '0px 10px 25px 5px rgba(0,0,0,0.5);',
        borderRadius: 1,
        padding: '16px 0px',
        zIndex: 100,
      }}
    >
      <MenuItem onClick={onClickPreview}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <VisibilityOutlined />
        </Box>
        <Box sx={{ ml: 2, mr: 2, fontSize: 14 }}>Preview</Box>
      </MenuItem>
      <Divider />
      <MenuItem onClick={onClickRename}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <DriveFileRenameOutline />
        </Box>
        <Box sx={{ ml: 2, mr: 2, fontSize: 14 }}>Rename</Box>
      </MenuItem>
      <Divider />
      <MenuItem onClick={onClickDownload}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Download />
        </Box>
        <Box sx={{ ml: 2, mr: 2, fontSize: 14 }}>Download</Box>
      </MenuItem>
      <Divider />
      <MenuItem onClick={onClickRemove}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <DeleteOutline />
        </Box>
        <Box sx={{ ml: 2, mr: 2, fontSize: 14 }}>Remove</Box>
      </MenuItem>
    </Box>
  )
}
