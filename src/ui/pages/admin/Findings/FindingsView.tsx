import { Box } from '@mui/material'
import Findings from '@components/tables/Findings/Findings'
import PaginationTable from 'src/ui/components/PaginationTable'
import SearchBar from './SearchBar/SearchBar'
import SimulationSelect from './SimulationSelect/SimulationSelect'
import _ from 'lodash'
import { observer } from 'mobx-react'
import { useState } from 'react'

// @ts-ignore
function FindingsView(props) {
  const [selectedSimulationId, setSelectedSimulationId] = useState<
    string | undefined
  >(undefined)
  const [searchString, setSearchString] = useState<string>('')

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'white',
          position: 'absolute',
          left: '16px',
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
      <Box
        sx={{
          backgroundColor: 'white',
          position: 'absolute',
          left: '50%',
          transform: 'translate(-50%, 0%)',
          mt: 2,
          zIndex: 1000,
        }}
      >
        <SimulationSelect setSelectedSimulationId={setSelectedSimulationId} />
      </Box>
      <PaginationTable
        collectionName={'findings'}
        params={{
          filter: { isDeleted: false },
          options: { fields: { selectedSimulationId, searchString } },
        }}
        Table={Findings}
        version={2}
      />
    </>
  )
}
export default observer(FindingsView)
