import AssessmentCycles from 'src/ui/core/components/tables/AssessmentCycles/AssessmentCycles'
import Box from '@mui/material/Box'
import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import PaginationTable from 'src/ui/components/PaginationTable'
import { observer } from 'mobx-react'

import SearchBar from './SearchBar/SearchBar'

import { useState } from 'react'

function AssessmentCyclesView({}: any) {

  const [searchString, setSearchString] = useState<string>('')

  const searchStringFilter = {
    $or: [
      { 'name': { $regex: searchString, $options: 'i' } },
    ],
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          backgroundColor: 'white',
          position: 'absolute',
          // transform: 'translate(-50%, 0%)',
          mt: 2,
          zIndex: 1000,
        }}
      >
      <SearchBar
        searchString={searchString}
        onChange={(e: any) => setSearchString(e.target.value)}
      />
      </Box>    
      <PaginationTable
        collectionName={'assessmentCycles'}
        Table={AssessmentCycles}
        version={1}
        params={{
          filter: { 
            isDeleted: false,
            ...searchStringFilter,
          },
          options: { multi: true, sort: { createdAt: -1 } },
        }}
        height={'calc(100vh - 240px)'}
      />
    </>
  )
}
export default observer(AssessmentCyclesView)
