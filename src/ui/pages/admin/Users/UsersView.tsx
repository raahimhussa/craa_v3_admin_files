import { Box } from '@mui/material'
import IUser from 'src/models/user/user.interface'
import PaginationTable from 'src/ui/components/PaginationTable'
import { Role } from 'src/models/role'
import SearchBar from './SearchBar/SearchBar'
import Users from 'src/ui/core/components/tables/Users/Users'
import { observer } from 'mobx-react'
import { useState } from 'react'

type Props = {
  role: Role
}

function UsersView({ role }: Props) {
  const [searchString, setSearchString] = useState<string>('')

  const searchStringFilter = {
    $or: [
      { 'profile.firstName': { $regex: searchString, $options: 'i' } },
      { 'profile.lastName': { $regex: searchString, $options: 'i' } },
      { 'profile.initial': { $regex: searchString, $options: 'i' } },
      { email: { $regex: searchString, $options: 'i' } },
      { name: { $regex: searchString, $options: 'i' } },
      { 'role.title': { $regex: searchString, $options: 'i' } },
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
        collectionName="users"
        version={1}
        Table={Users}
        params={{
          filter: {
            isDeleted: false,
            roleId: { $ne: role._id },
            ...searchStringFilter,
          },
          options: { multi: true },
        }}
        searchString={searchString}
        height={'calc(100vh - 200px)'}
      />
    </>
  )
}
export default observer(UsersView)
