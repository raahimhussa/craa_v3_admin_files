import { Box, Divider, Button } from '@mui/material'
import { useCallback, useState } from 'react'

import { Folder } from '@mui/icons-material'
import { FolderContextMenu } from './FolderContextMenu'
import { useDropzone } from 'react-dropzone'
import { useUploadPopup } from './useUploadPopup'

import moment from 'moment'

type Props = {
  folder: any
  onAddFolderPath: (path: string) => void
  mutate: any
}

export const FolderListIcon = ({ folder, onAddFolderPath, mutate }: Props) => {
  const { getSingleUploadFile } = useUploadPopup()
  const [openContextMenu, setOpenContextMenu] = useState<boolean>(false)
  const [menuPosition, setMenuPosition] = useState<{
    top: number
    left: number
  }>({ top: 0, left: 0 })
  const onDrop = useCallback(
    async (acceptedFiles) => {
      const currentPath = folder.path + '/' + folder.name
      acceptedFiles.map((_acceptedFile: any) => {
        _acceptedFile.modifiedPath = currentPath + _acceptedFile.path
      })
      const fileItems = await Promise.all(
        acceptedFiles.map(getSingleUploadFile)
      )
    },
    [folder.path]
  )
  const { getRootProps, getInputProps, isDragActive: isDragDefaultActive, open: defaultOpen } = useDropzone({
    onDrop,
    noDragEventsBubbling: true,
    noClick: true,
    noKeyboard: true,
    useFsAccessApi: false 
  })

  const { getRootProps: getFileRootProps, getInputProps: getFileInputProps, isDragActive: isDragActive4File, open: fileOpen } = useDropzone({
    noClick: true,
    // onDrop: (acceptedFiles) => {
    //   // Handle file upload logic here
    // },
    onDrop,
  });
  
  const { getRootProps: getFolderRootProps, getInputProps: getFolderInputProps, isDragActive: isDragActive4Folder, open: folderOpen } = useDropzone({
    noClick: true,
    noKeyboard: true,
    // webkitdirectory: true,
    // onDrop: (acceptedFiles) => {
    //   // Handle folder upload logic here
    // },
    // seFsAccessApi: true,
    onDrop,
  });

  return (
    <>    
      <Box
        sx={{
          display: 'flex',
          margin: '8px',
          padding: '8px 0px',
          border: isDragDefaultActive ? '2px solid rgba(80,188,223,1)' : undefined,
          backgroundColor: isDragDefaultActive ? 'rgba(80,188,223,0.1)' : 'white',
          borderRadius: isDragDefaultActive ? 1 : undefined,
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.05)',
          },
        }}
        onDoubleClick={() => onAddFolderPath(folder.name)}
        onContextMenu={(e) => {
          e.preventDefault() // prevent the default behaviour when right clicked
          setOpenContextMenu(true)
          console.log({ e })
          setMenuPosition({ top: e.pageY, left: e.pageX })
        }}
        key={folder._id}
        {...getRootProps()}
      >
        <Box
          sx={{
            width: 56,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Folder />
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
          {folder.name}
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
            {moment(folder.updatedAt).format('DD-MMM-YYYY hh:mm:ss')}
          </Box>   
          <Box sx={{ width: 16 }} />
      </Box>
      <Divider />
      <FolderContextMenu
        folder={folder}
        open={openContextMenu}
        onClose={() => setOpenContextMenu(false)}
        top={menuPosition.top}
        left={menuPosition.left}
        mutate={mutate}
      />
    </>
  )
}
