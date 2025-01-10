import { Box, Divider } from '@mui/material'
import { useCallback, useState } from 'react'

import { Folder } from '@mui/icons-material'
import { FolderContextMenu } from './FolderContextMenu'
import { useDropzone } from 'react-dropzone'
import { useUploadPopup } from './useUploadPopup'

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
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noDragEventsBubbling: true,
    noClick: true,
  })

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          margin: '8px',
          padding: '8px 0px',
          border: isDragActive ? '2px solid rgba(80,188,223,1)' : undefined,
          backgroundColor: isDragActive ? 'rgba(80,188,223,0.1)' : 'white',
          borderRadius: isDragActive ? 1 : undefined,
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
        {...getRootProps()}
      >
        <input {...getInputProps()} multiple />
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
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          {folder.name}
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          {folder.size}
        </Box>
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
