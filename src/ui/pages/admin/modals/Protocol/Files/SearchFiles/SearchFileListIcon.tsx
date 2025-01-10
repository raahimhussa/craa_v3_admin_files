import {
  Article,
  DeleteOutline,
  DriveFileMoveOutlined,
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
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import { useRootStore } from 'src/stores'
import { useState } from 'react'

type Props = {
  file: File
  mutate: any
  onNavigateFolderFullPath: (fullPath: string) => void
}

export const SearchFileListIcon = observer(
  ({ file, mutate, onNavigateFolderFullPath }: Props) => {
    const {
      findingStore,
      docStore,
      uiState: { modal },
    } = useRootStore()
    const [openContextMenu, setOpenContextMenu] = useState<boolean>(false)
    const [menuPosition, setMenuPosition] = useState<{
      top: number
      left: number
    }>({ top: 0, left: 0 })

    const onHandlePreview = (e: any) => {
      e.stopPropagation()
      modal.open('ViewFile', <PDFViewer fileUrl={file.url} />)
    }
    const onClickSelect = async () => {
      docStore.form.file = file
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
        <Tooltip title={(file as any).path || ''} placement="top-end">
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              margin: '8px',
              padding: '8px 0px',
              cursor: 'pointer',
              backgroundColor:
                toJS(docStore.form.file)?._id === file._id
                  ? openContextMenu
                    ? 'rgba(128,255,90,0.3)'
                    : 'rgba(128,255,90,0.3)'
                  : openContextMenu
                  ? 'rgba(24,90,255,0.1)'
                  : 'white',
              '&:hover': {
                backgroundColor:
                  toJS(docStore.form.file)?._id === file._id
                    ? openContextMenu
                      ? 'rgba(128,255,90,0.3)'
                      : 'rgba(128,255,90,0.3)'
                    : openContextMenu
                    ? 'rgba(24,90,255,0.1)'
                    : 'rgba(0,0,0,0.07)',
              },
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
                  width: 96,
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
                <Button
                  sx={{ minWidth: 0 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onNavigateFolderFullPath((file as any).path)
                  }}
                >
                  <DriveFileMoveOutlined />
                </Button>
              </Box>
            </Box>
          </Box>
        </Tooltip>
        <Divider />
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
)

export const FileMiniIcon = ({ mimeType }: { mimeType: string }) => {
  if (mimeType === 'application/pdf') {
    return <PictureAsPdf color="error" />
  }
  return <Article />
}
