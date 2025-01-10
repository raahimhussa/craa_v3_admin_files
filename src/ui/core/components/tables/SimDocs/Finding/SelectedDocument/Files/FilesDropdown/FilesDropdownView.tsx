import { Autocomplete, Box, TextField } from '@mui/material'
import { useCallback, useState } from 'react'

import File from 'src/models/file'
import { FileGridIcon } from './FileGridIcon'
import { FileListIcon } from './FileListIcon'
import FilesViewMenu from './FilesViewMenu'
import { FolderGridIcon } from './FolderGridIcon'
import { FolderListIcon } from './FolderListIcon'
import _ from 'lodash'
import { observer } from 'mobx-react'
import { useDropzone } from 'react-dropzone'
import { useRootStore } from 'src/stores'
import { useUploadPopup } from './useUploadPopup'

type Props = {
  pdfFileManagement: { files: File[]; folders: any[] }
  pdfFileManagementMutate: any
  onAddFolderPath: (path: string) => void
  currentPaths: string[]
  onClose: () => void
}

function FilesDropdownView({
  pdfFileManagement: { files, folders },
  pdfFileManagementMutate,
  onAddFolderPath,
  onClose,
  currentPaths,
}: Props) {
  const {
    uiState: { pdfViewType },
  } = useRootStore()
  return (
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
        padding: '24px',
        border: '2px solid white',
        borderRadius: 1,
        backgroundColor: 'white',
      }}
    >
      {folders.length === 0 ? null : pdfViewType.type === 'grid' ? (
        <Box>
          <Box sx={{ ml: 2 }}>Folders</Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {folders.map((_folder) => (
              <Box className={'pdf_folder'}>
                <FolderGridIcon
                  key={_folder._id}
                  folder={_folder}
                  onAddFolderPath={onAddFolderPath}
                  mutate={pdfFileManagementMutate}
                />
              </Box>
            ))}
          </Box>
        </Box>
      ) : (
        <Box>
          {folders.map((_folder) => (
            <Box className={'pdf_folder'}>
              <FolderListIcon
                key={_folder._id}
                folder={_folder}
                onAddFolderPath={onAddFolderPath}
                mutate={pdfFileManagementMutate}
              />
            </Box>
          ))}
        </Box>
      )}
      {files.length === 0 ? null : pdfViewType.type === 'grid' ? (
        <Box>
          <Box sx={{ ml: 2 }}>Files</Box>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {files
              .sort((a, b) => (a.name > b.name ? 1 : -1))
              .map((_file) => (
                <FileGridIcon
                  key={_file._id}
                  file={_file}
                  mutate={pdfFileManagementMutate}
                  onClose={onClose}
                />
              ))}
          </Box>
        </Box>
      ) : (
        <Box>
          {files
            .sort((a, b) => (a.name > b.name ? 1 : -1))
            .map((_file) => (
              <FileListIcon
                key={_file._id}
                file={_file}
                mutate={pdfFileManagementMutate}
                onClose={onClose}
              />
            ))}
        </Box>
      )}
    </Box>
  )
}
export default observer(FilesDropdownView)
