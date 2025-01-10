import { Box } from '@mui/material'
import PaginationTable from 'src/ui/components/PaginationTable'
import SearchBar from './SearchBar/SearchBar'
import SimDistributions from '@components/tables/SimDistributions/SimDistributions'
import { UserSimulationStatus } from 'src/utils/status'
import { observer } from 'mobx-react'
import { useState } from 'react'
function SimDistributionsView({ userSimulations }: any) {
  const [searchString, setSearchString] = useState<string>('')

  const searchStringFilter = {
    $or: [
      { 'user.profile.firstName': { $regex: searchString, $options: 'i' } },
      { 'user.profile.lastName': { $regex: searchString, $options: 'i' } },
      { 'user.profile.initial': { $regex: searchString, $options: 'i' } },
      { 'clientUnit.name': { $regex: searchString, $options: 'i' } },
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
          zIndex: 100,
        }}
      >
        <SearchBar
          searchString={searchString}
          onChange={(e: any) => setSearchString(e.target.value)}
        />
      </Box>
      <PaginationTable
        collectionName="simDistribution"
        Table={SimDistributions}
        version={3}
        searchString={searchString}
        params={{
          filter: {
            isDeleted: false,
            $and: [
              {
                $or: [
                  {
                    'userBaseline.status': UserSimulationStatus.Published,
                  },
                  {
                    'userBaseline.status': UserSimulationStatus.Distributed,
                    $and: [
                      {
                        'userFollowups.status': {
                          $eq: UserSimulationStatus.Published,
                          $ne: [
                            UserSimulationStatus.Assigned,
                            UserSimulationStatus.InProgress,
                            UserSimulationStatus.Scoring,
                            UserSimulationStatus.Pending,
                            UserSimulationStatus.Adjudicating,
                          ],
                        },
                      },
                    ],
                  },
                ],
              },
              { ...searchStringFilter },
            ],
          },
        }}
      />
      {/* <PaginationTable
        collectionName="userSimulations"
        Table={SimDistributions}
        version={2}
        params={{
          filter: {
            isDeleted: false,
            status: UserSimulationStatus.Distributed,
          },
        }}
      /> */}
    </>
  )
  // NOTE - 같은 페이지에 pagination table 1개 더 (status === UserSimulationStatus.Distributed)
  // return <SimDistributions userSimulations={userSimulations} />
}
export default observer(SimDistributionsView)
