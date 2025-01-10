import { Article, Folder, PictureAsPdf } from '@mui/icons-material'
import { Box, Tooltip } from '@mui/material'

import File from 'src/models/file'
import { FileContextMenu } from './FileContextMenu'
import PDFViewer from '@components/tables/SimDocs/Finding/SelectedDocument/PDFViewer/PDFViewer'
import { useRootStore } from 'src/stores'
import { useState } from 'react'

type Props = {
  file: File
  mutate: any
  onClose: () => void
}

export const FileGridIcon = ({ file, mutate, onClose }: Props) => {
  const {
    uiState: { modal },
    findingStore,
    simDocStore,
  } = useRootStore()
  const [openContextMenu, setOpenContextMenu] = useState<boolean>(false)
  const [menuPosition, setMenuPosition] = useState<{
    top: number
    left: number
  }>({ top: 0, left: 0 })

  const onClickSelect = async () => {
    const simDocId = findingStore.selectedSimDoc?._id
    const selectedSimDocMutate = findingStore.selectedSimDocMutate
    await simDocStore.update(simDocId, { files: [file] })
    selectedSimDocMutate && (await selectedSimDocMutate())
    onClose()
  }

  return (
    <>
      <Tooltip title={file.name}>
        <Box
          sx={{
            display: 'flex',
            width: 300,
            margin: '8px',
            padding: '8px 0px',
            border: '1px solid black',
            borderRadius: 1,
            backgroundColor: openContextMenu ? 'rgba(24,90,255,0.1)' : 'white',
            '&:hover': {
              backgroundColor: openContextMenu
                ? 'rgba(24,90,255,0.1)'
                : 'rgba(0,0,0,0.07)',
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
          <Box sx={{ display: 'flex' }}>
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
                width: 224,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              {file.name}
            </Box>
          </Box>
        </Box>
      </Tooltip>
      <FileContextMenu
        file={file}
        open={openContextMenu}
        onClose={() => setOpenContextMenu(false)}
        top={menuPosition.top}
        left={menuPosition.left}
        mutate={mutate}
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
