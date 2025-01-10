import { Box, Divider } from '@mui/material'
import { observer, useLocalObservable } from 'mobx-react'
import { useEffect, useState } from 'react'

import Files from 'src/ui/core/components/tables/Files/Files'
import FilesDropdown from './FilesDropdown/FilesDropdown'
import FilesViewMenu from './FilesDropdown/FilesViewMenu'
import { FolderPath } from './FolderPath'
import PaginationTable from 'src/ui/components/PaginationTable'
import SearchBar from './SearchBar/SearchBar'
import SearchFiles from './SearchFiles/SearchFiles'
import SimulationSelect from './SimulationSelect/SimulationSelect'
import axios from 'axios'

type Props = {
  onClose: () => void
}

function FilesView({ onClose }: Props) {
  // const [selectedSimulationId, setSelectedSimulationId] = useState<
  //   string | undefined
  // >(undefined)
  const [searchString, setSearchString] = useState<string>('')
  const [currentPaths, setCurrentPaths] = useState<string[]>(['Home'])

  const onAddFolderPath = (path: string) => {
    setCurrentPaths((prev) => [...prev, path])
  }

  const onNavigateFolderPath = (index: number) => {
    setCurrentPaths((prev) => prev.slice(0, index + 1))
  }

  const onNavigateFolderFullPath = (fullPath: string) => {
    const paths = fullPath.split('/').filter((_) => _)
    setCurrentPaths(paths)
    setSearchString('')
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 280px)',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          position: 'sticky',
          top: 0,
          // left: '16px',
          // transform: 'translate(-50%, 0%)',
          pt: 2,
          zIndex: 100,
        }}
      >
        <SearchBar
          searchString={searchString}
          onChange={(e: any) => setSearchString(e.target.value)}
        />
        <Divider />
        {searchString ? null : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <FolderPath
                currentPaths={currentPaths}
                onNavigateFolderPath={onNavigateFolderPath}
              />
              <FilesViewMenu />
            </Box>
            <Divider />
          </>
        )}
      </Box>
      {/* <Box
        sx={{
          backgroundColor: 'white',
          position: 'absolute',
          left: '50%',
          transform: 'translate(-50%, 0%)',
          mt: 2,
          zIndex: 100,
        }}
      >
        <SimulationSelect setSelectedSimulationId={setSelectedSimulationId} />
      </Box> */}
      {searchString ? (
        <SearchFiles
          onNavigateFolderFullPath={onNavigateFolderFullPath}
          currentPaths={currentPaths}
          onNavigateFolderPath={onNavigateFolderPath}
          searchString={searchString}
          onClose={onClose}
          // folderId={'63f5cb20bd616abb957dc7b9'}
        />
      ) : (
        <FilesDropdown
          onAddFolderPath={onAddFolderPath}
          currentPaths={currentPaths}
          onNavigateFolderPath={onNavigateFolderPath}
          searchString={searchString}
          onClose={onClose}
          // folderId={'63f5cb20bd616abb957dc7b9'}
        />
      )}
      {/* <PaginationTable
        collectionName="files"
        Table={Files}
        version={1}
        params={{
          filter: {
            mimeType: 'application/pdf',
            isDeleted: false,
            name: { $regex: searchString, $options: 'i' },
          },
          options: { fields: { selectedSimulationId, searchString } },
        }}
      /> */}
    </Box>
  )
}
export default observer(FilesView)
