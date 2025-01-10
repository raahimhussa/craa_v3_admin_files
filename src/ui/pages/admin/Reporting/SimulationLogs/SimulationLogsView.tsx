import 'react-datepicker/dist/react-datepicker.css'

import { Box, Typography } from '@mui/material'

import DatePicker from 'react-datepicker'
import PaginationTable from 'src/ui/components/PaginationTable'
import SearchBar from './SearchBar/SearchBar'
import SimulationLogs from '@components/tables/SimulationLogs/SimulationLogs'
import { observer } from 'mobx-react'
import { useState } from 'react'

function SimulationLogsView(props: any) {
  // const { authStore } = useRootStore()
  const { userBaseline, userFollowups, userId } = props
  const [selectedSimulationId, setSelectedSimulationId] = useState<
    string | undefined
  >(undefined)
  const [searchString, setSearchString] = useState<string>('')
  const [startDate, setStartDate] = useState<any>('')
  const [endDate, setEndDate] = useState<any>('')

  return (
    <Box
      sx={{
        position: 'relative',
      }}
    >
      <PaginationTable
        collectionName="logManager/simulationLogs"
        Table={SimulationLogs}
        version={3}
        params={{
          filter: {
            'target.type': 'userSimulations',
            'target._id': {
              $in: [
                userBaseline?._id,
                ...userFollowups.map((_userFollowup: any) => _userFollowup._id),
              ],
            },
          },
          options: {
            fields: { searchString },
            sort: { createdAt: -1 },
          },
        }}
      />
    </Box>
  )
}
export default observer(SimulationLogsView)
