import { observer, useLocalObservable } from 'mobx-react'

import { Box } from '@mui/material'
import Files from 'src/ui/core/components/tables/Files/Files'
import PaginationTable from 'src/ui/components/PaginationTable'
import SearchBar from './SearchBar/SearchBar'
import SimulationSelect from './SimulationSelect/SimulationSelect'
import { useEffect, useState } from 'react'
import Documents from '@components/tables/Documents/Documents'
import DocumentWithoutbuttons from '@components/tables/DocumentsWithoutButtons/DocumentsWithoutButtons'
import { useRootStore } from 'src/stores'

function DocumentsView(props: any) {
  const { documentStore } = useRootStore()
  const [selectedSimulationId, setSelectedSimulationId] = useState<
    string | undefined
  >(undefined)
  const [searchString, setSearchString] = useState<string>('')
  const [value, setValue] = useState(0)

  // useEffect(() => {
  //   console.log('dhdhdlsljdljfl')
  // }, [documentStore.doUpdate || !documentStore.doUpdate])

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'white',
          position: 'absolute',
          left: '16px',
          // transform: 'translate(-50%, 0%)',
          mt: 2,
          zIndex: 110,
        }}
      >
        <SearchBar
          searchString={searchString}
          onChange={(e: any) => {
            setSearchString(e.target.value)
          }}
        />
      </Box>
      {props.withButtons ? (
        <PaginationTable
          collectionName="documents"
          Table={Documents}
          version={1}
          params={{
            filter: {
              isDeleted: false,
            },
            options: {
              fields: { selectedSimulationId, searchString },
              mutate: documentStore.doUpdate,
            },
          }}
        />
      ) : (
        <PaginationTable
          collectionName="documents"
          Table={DocumentWithoutbuttons}
          version={1}
          params={{
            filter: {
              isDeleted: false,
            },
            options: {
              fields: { selectedSimulationId, searchString },
              mutate: documentStore.doUpdate,
            },
          }}
        />
      )}
    </>
  )
}
export default observer(DocumentsView)
