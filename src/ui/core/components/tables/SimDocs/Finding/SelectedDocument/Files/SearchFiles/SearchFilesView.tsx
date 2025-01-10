import { Autocomplete, Box, TextField } from '@mui/material'

import File from 'src/models/file'
import { SearchFileListIcon } from './SearchFileListIcon'
import _ from 'lodash'
import { observer } from 'mobx-react'

type Props = {
  pdfFileManagement: { files: File[]; folders: any[] }
  pdfFileManagementMutate: any
  onNavigateFolderFullPath: (fullPath: string) => void
  currentPathFolders: any[]
  onClose: () => void
}

function SearchFilesView({
  pdfFileManagement: { files, folders },
  pdfFileManagementMutate,
  onNavigateFolderFullPath,
  onClose,
}: Props) {
  return (
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
        padding: '24px',
        border: '2px solid white',
        backgroundColor: 'white',
      }}
    >
      {files.length === 0 ? (
        <Box>No search results.</Box>
      ) : (
        <>
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
                <SearchFileListIcon
                  key={_file._id}
                  file={_file}
                  mutate={pdfFileManagementMutate}
                  onNavigateFolderFullPath={onNavigateFolderFullPath}
                  onClose={onClose}
                />
              ))}
          </Box>
        </>
      )}
    </Box>
  )
}
export default observer(SearchFilesView)
