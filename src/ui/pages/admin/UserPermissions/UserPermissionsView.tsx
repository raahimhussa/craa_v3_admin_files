import { Box, Divider, MenuItem, Select, Typography } from '@mui/material'
import { observer, useLocalObservable } from 'mobx-react'
import { useEffect, useState } from 'react'

import Files from 'src/ui/core/components/tables/Files/Files'
import PaginationTable from 'src/ui/components/PaginationTable'
import SearchBar from './SearchBar/SearchBar'
import SimulationSelect from './SimulationSelect/SimulationSelect'
import TrainingLogs from '@components/tables/TrainingLogs/TrainingLogs'
import Users from '@components/tables/UserPermissions/Users'
import moment from 'moment'

function UserPermissionsView(props: any) {
  // const { authStore } = useRootStore()
  const { userId, clientUnits } = props
  const [clientId, setClientId] = useState<string | undefined>(undefined)
  const [searchString, setSearchString] = useState<string>('')
  const renderClientUnitMenu = () => {
    const clientUnitParentMenu = clientUnits
      .filter((client: any) => !client.vendor)
      .sort((a: any, b: any) => (a.name > b.name ? 1 : -1))

    const clientUnitChildMenu = clientUnits
      .filter((client: any) => !!client.vendor)
      .sort((a: any, b: any) => (a.name > b.name ? 1 : -1))

    const all = <MenuItem value={''}>All</MenuItem>
    let ret = [all]

    clientUnitParentMenu.forEach((_pm: any) => {
      const cms = clientUnitChildMenu
        .filter((_cm: any) => _cm.vendor === _pm._id)
        .map((_cm: any) => (
          <MenuItem value={_cm._id}>
            <Box sx={{ ml: 1 }}>{_cm.name}</Box>
          </MenuItem>
        ))
      const pm = (
        <MenuItem value={_pm._id} disabled={_pm.name === 'Pfizer'}>
          {_pm.name}
        </MenuItem>
      )
      ret = [...ret, <Divider />, pm, ...cms]
    })
    return [...ret, <Box sx={{ height: 12 }} />]
  }

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'rgb(242, 243, 243)',
          position: 'absolute',
          left: '16px',
          // transform: 'translate(-50%, 0%)',
          pt: 2,
          zIndex: 100,
          width: '100%',
        }}
      >
        <Select
          onChange={(e: any) => {
            setClientId(e.target.value)
          }}
          sx={{
            width: '300px',
            height: '37px',
            mr: 1,
          }}
        >
          {renderClientUnitMenu()}
        </Select>
        <SearchBar
          searchString={searchString}
          onChange={(e: any) => {
            setSearchString(e.target.value)
          }}
        />
      </Box>
      <PaginationTable
        collectionName="users"
        Table={Users}
        version={1}
        params={{
          filter: {
            isDeleted: false,
            // 'authority.whitelist.clientId': clientId ? clientId : undefined,
            'authority.whitelist': {
              $elemMatch: {
                clientId: clientId ? clientId : undefined,
              },
            },
            roleId: {
              $in: props.roles
                .filter(
                  (role: any) =>
                    role.title == 'ClientAdmin' ||
                    role.title === 'ClientSubAdmin'
                )
                .map((_role: any) => _role._id),
            },
          },
          projection: {
            whitelist: 1,
            authority: 1,
            role: 1,
            profile: 1,
          },
          options: {
            multi: true,
            fields: { searchString },
            lookupWhitelist: true,
          },
        }}
      />
    </>
  )
}
export default observer(UserPermissionsView)
