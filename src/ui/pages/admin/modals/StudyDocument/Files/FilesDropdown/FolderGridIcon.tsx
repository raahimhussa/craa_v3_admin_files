import { useCallback, useState } from 'react'

import { Box } from '@mui/material'
import { Folder } from '@mui/icons-material'
import { FolderContextMenu } from './FolderContextMenu'
import { useDropzone } from 'react-dropzone'
import { useUploadPopup } from './useUploadPopup'

type Props = {
  folder: any
  onAddFolderPath: (path: string) => void
  mutate: any
}

export const FolderGridIcon = ({ folder, onAddFolderPath, mutate }: Props) => {
  const [openContextMenu, setOpenContextMenu] = useState<boolean>(false)
  const [menuPosition, setMenuPosition] = useState<{
    top: number
    left: number
  }>({ top: 0, left: 0 })

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          width: 300,
          margin: '8px',
          border: '2px solid #aaaaaa',
          backgroundColor: 'white',
          borderRadius: 1,
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.05)',
          },
        }}
        onDoubleClick={() => onAddFolderPath(folder.name)}
        onContextMenu={(e) => {
          e.preventDefault() // prevent the default behaviour when right clicked
          setOpenContextMenu(true)
          setMenuPosition({ top: e.pageY, left: e.pageX })
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 48,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Folder />
        </Box>
        <Box
          sx={{
            width: 240,
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          {folder.name.length > 20
            ? folder.name.substring(0, 18) + '...'
            : folder.name}
        </Box>
      </Box>
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
