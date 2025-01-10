import { observer, useLocalObservable } from 'mobx-react'

import { Box, Typography } from '@mui/material'
import Files from 'src/ui/core/components/tables/Files/Files'
import PaginationTable from 'src/ui/components/PaginationTable'
import SearchBar from './SearchBar/SearchBar'
import SimulationSelect from './SimulationSelect/SimulationSelect'
import { useEffect, useState } from 'react'
import TrainingLogs from '@components/tables/TrainingLogs/TrainingLogs'
import moment from 'moment'
import Users from '@components/tables/LogsExport/Users'

function UserLogsView(props: any) {
  // const { authStore } = useRootStore()
  const { userId } = props
  const [selectedSimulationId, setSelectedSimulationId] = useState<
    string | undefined
  >(undefined)
  const [searchString, setSearchString] = useState<string>('')

  return (
    <Box
      sx={{
        position: 'relative',
        mt: 2,
      }}
    >
      <SearchBar
        searchString={searchString}
        onChange={(e: any) => {
          setSearchString(e.target.value)
        }}
      />
      <PaginationTable
        collectionName="users"
        Table={Users}
        version={1}
        params={{
          filter: {
            isDeleted: false,
            name: {
              $ne: 'superAdmin',
            },
          },
          options: { multi: true, fields: { searchString } },
        }}
      />
    </Box>
  )
}
export default observer(UserLogsView)
