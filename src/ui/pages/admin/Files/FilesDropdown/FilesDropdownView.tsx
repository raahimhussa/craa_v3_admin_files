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
}

function FilesDropdownView({
  pdfFileManagement: { files, folders },
  pdfFileManagementMutate,
  onAddFolderPath,
  currentPaths,
}: Props) {
  const {
    uiState: { pdfViewType },
  } = useRootStore()
  const { getSingleUploadFile } = useUploadPopup()
  const onDrop = useCallback(
    async (acceptedFiles) => {
      const currentPath = '/' + currentPaths.join('/')
      acceptedFiles.map((_acceptedFile: any) => {
        _acceptedFile.modifiedPath = (
          currentPath +
          '/' +
          _acceptedFile.path
        ).replace('//', '/')
      })
      await Promise.all(acceptedFiles.map(getSingleUploadFile))
    },
    [currentPaths.length]
  )
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  })
  return (
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
        padding: '24px',
        border: isDragActive
          ? '2px solid rgba(80,188,223,1)'
          : '2px solid white',
        borderRadius: isDragActive ? 1 : undefined,
        backgroundColor: isDragActive ? 'rgba(80,188,223,0.1)' : 'white',
      }}
      {...getRootProps()}
    >
      <input id="hidden-file-input" {...getInputProps()} multiple style={{ display: 'none' }} />
      <input id="hidden-folder-input" {...getInputProps()} multiple webkitdirectory="" style={{ display: 'none' }} />
      <input {...getInputProps()} multiple  />
      {folders.length === 0 ? null : pdfViewType.type === 'grid' ? (
        <Box>
          <Box sx={{ ml: 2 }}>Folders</Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {folders
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((_folder) => (
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
          {folders
            // .sort((a, b) => (a.name > b.name ? 1 : -1))
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((_folder) => (
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
              // .sort((a, b) => (a.name > b.name ? 1 : -1))
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((_file) => (
                <FileGridIcon
                  key={_file._id}
                  file={_file}
                  mutate={pdfFileManagementMutate}
                />
              ))}
          </Box>
        </Box>
      ) : (
        <Box>
          {files
            // .sort((a, b) => (a.name > b.name ? 1 : -1))
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((_file) => (
              <FileListIcon
                key={_file._id}
                file={_file}
                mutate={pdfFileManagementMutate}
              />
            ))}
        </Box>
      )}
    </Box>
  )
}
export default observer(FilesDropdownView)
