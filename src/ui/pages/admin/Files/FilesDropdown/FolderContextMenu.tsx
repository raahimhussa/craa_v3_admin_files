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

import { useDropzone } from 'react-dropzone';

import {
  AdminLogManager,
  AdminLogTargetType,
} from 'src/classes/adminLogManager'
import { AdminLogScreen } from 'src/utils/status'

import { useUser } from '@hooks'

type Props = {
  mutate: any
  folder: any
  open: boolean
  onClose: () => void
  top: number
  left: number
}

export const FolderContextMenu = ({
  mutate,
  folder,
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
  const [renameText, setRenameText] = useState<string>(folder.name)

// State and hook for dropzone
// const [uploadType, setUploadType] = useState<null | 'file' | 'folder'>(null);
const { getRootProps, getInputProps, open: openDropzone } = useDropzone({
  noClick: true,
  noKeyboard: true,
  multiple: true,
  // onDrop: (acceptedFiles) => {
  //   if (uploadType === 'file') {
  //     // Handle file upload logic here
  //   } else if (uploadType === 'folder') {
  //     // Handle folder upload logic here
  //   }
  //   setUploadType(null); // Reset upload type after handling files
  // },
});

// const handleFileUploadClick = () => {
//   // const inputElement = document.getElementById(`hidden-${uploadType}-input`);
//   const inputElement = document.getElementById(`hidden-file-input`);
//   if (inputElement) {
//     inputElement.click();
//   }
//   onClose()
// };

// const handleFolderUploadClick = () => {
//   // const inputElement = document.getElementById(`hidden-${uploadType}-input`);
//   const inputElement = document.getElementById(`hidden-folder-input`);
//   if (inputElement) {
//     inputElement.click();
//   }
//   onClose()
// }; 

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
    setRenameText(folder.name)
  }, [open])

  const onClickRename = async () => {
    setOpenUpdateDialogue(true)
    onClose()
  }
  const onClickRemove = async () => {
    setOpenDeleteDialogue(true)
    onClose()
  }
  const onHandleRename = async () => {
    const _pdfFoldersRenamed = await axios.patch('v3/pdfFileManagement/rename', {
      id: folder._id,
      changedName: renameText,
      type: 'folder',
    })
    // await axios.patch('v2/pdfFolders', {
    //   filter: {
    //     _id: folder._id,
    //   },
    //   update: {
    //     name: renameText,
    //   },
    // })
    mutate && (await mutate())

    // console.log(_pdfFoldersRenamed)

    if(_pdfFoldersRenamed?.data && _pdfFoldersRenamed?.request?.status === 200) {
    
      adminLogManager?.createEditLog({
        screen: AdminLogScreen.PDFFiles,
        target: {
          type: AdminLogTargetType.PDFFiles,          
          _id: folder._id || null,
          origin: folder.name || '',
          new: renameText || '',
          path: folder.path || '',
          message: 'PDF folders renamed',
          _key: 'rfo'
        },
        resource: {
          // ...this.form,
        },
      })      
      
    }    
  }
  const onHandleRemove = async () => {
    const _pdfFoldersRemoved = await axios.delete('v2/pdfFolders', {
      params: {
        filter: {
          _id: folder._id,
        },
      },
    })
    mutate && (await mutate())

    // console.log(_pdfFoldersRemoved);

    if(_pdfFoldersRemoved?.data?.deletedCount === 1 && _pdfFoldersRemoved?.request?.status === 200) {
    
      adminLogManager?.createDeleteLog({
        screen: AdminLogScreen.PDFFiles,
        target: {
          type: AdminLogTargetType.PDFFiles,          
          _id: folder._id || null,
          origin: folder.name || '',
          path: folder.path || '',
          message: 'PDF folders deleted',
          _key: 'dfo'
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
          title={`Are you sure you want to delete "${folder.name}"?`}
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
          title={`Are you sure you want to rename "${folder.name}"?`}
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

      {/* <Divider />
      <MenuItem onClick={handleFileUploadClick}>
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >    
  </Box>
  <Box sx={{ ml: 2, mr: 2, fontSize: 14 }}>File Upload</Box>
</MenuItem>
<Divider />
<MenuItem onClick={handleFolderUploadClick}>
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >    
  </Box>
  <Box sx={{ ml: 2, mr: 2, fontSize: 14 }}>Folder Upload</Box>
</MenuItem> */}

    </Box>
  )
}
