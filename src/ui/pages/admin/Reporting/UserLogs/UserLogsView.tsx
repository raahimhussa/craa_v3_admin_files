import { observer, useLocalObservable } from 'mobx-react'

import { Box, Typography } from '@mui/material'
import Files from 'src/ui/core/components/tables/Files/Files'
import PaginationTable from 'src/ui/components/PaginationTable'
import SearchBar from './SearchBar/SearchBar'
import SimulationSelect from './SimulationSelect/SimulationSelect'
import { useEffect, useState } from 'react'
import Logs from '@components/tables/LogsTable/Logs'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'

function UserLogsView(props: any) {
  // const { authStore } = useRootStore()
  const { userId } = props
  console.log(userId)
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
      <Box
        sx={{
          backgroundColor: 'white',
          position: 'absolute',
          left: '0',
          // transform: 'translate(-50%, 0%)',
          zIndex: 100,
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <SearchBar
          searchString={searchString}
          onChange={(e: any) => {
            setSearchString(e.target.value)
          }}
        />
        <DatePicker
          selected={startDate}
          onChange={(date) => {
            setStartDate(date)
            console.log(date)
          }}
          dateFormat="dd-MM-yyyy"
        />
        <Typography
          sx={{
            ml: 1,
            fontWeight: 600,
          }}
        >
          ~
        </Typography>
        <DatePicker
          selected={endDate}
          onChange={(date) => {
            setEndDate(date)
          }}
          dateFormat="dd-MM-yyyy"
        />
      </Box>
      <PaginationTable
        collectionName="logs"
        Table={Logs}
        version={2}
        params={{
          filter: {
            userId: userId,
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
          },
          options: {
            fields: { searchString },
            isTable: true,
          },
        }}
      />
    </Box>
  )
}
export default observer(UserLogsView)
