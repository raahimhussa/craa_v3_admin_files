import { Box } from '@mui/material'
import PaginationTable from 'src/ui/components/PaginationTable'
import SearchBar from './SearchBar/SearchBar'
import SimManagementFilter from './SimManagementFilter/SimManagementFilter'
import SimManagementTable from '@components/tables/SimManagement/SimManagement'
import _ from 'lodash'
import { observer } from 'mobx-react'
import { useState } from 'react'
// @ts-ignore

type Prop = {
  userSimulations: any[]
}

function SimManagementView(props: Prop) {
  const [filter, setFilter] = useState<any>({})
  const [options, setOptions] = useState<any>({})
  const [searchString, setSearchString] = useState<string>('')

  const handleFilter = (filter: any, options: any) => {
    setFilter(filter)
    setOptions(options)
  }

  const onChangeSearchString = (e: any) => {
    setSearchString(e?.target?.value || '')
  }

  const searchStringFilter = () => {
    return {
      $or: [
        { 'clientUnit.name': { $regex: searchString, $options: 'i' } },
        {
          'user.profile.firstName': {
            $regex: searchString,
            $options: 'i',
          },
        },
        {
          'user.profile.lastName': {
            $regex: searchString,
            $options: 'i',
          },
        },
        {
          'userBaseline.simulation.name': {
            $regex: searchString,
            $options: 'i',
          },
        },
        {
          'userBaseline.status': { $regex: searchString, $options: 'i' },
        },
      ],
    }
  }

  return (
    <>
      <SimManagementFilter
        handleFilter={handleFilter}
        searchString={searchString}
        onChangeSearchString={onChangeSearchString}
        appliedFilter={{ filter, options }}
      />
      <PaginationTable
        collectionName={'simManagement'}
        Table={SimManagementTable}
        params={{ filter: { ...filter, ...searchStringFilter() }, options }}
        searchString={searchString}
        version={3}
      />
    </>
  )
}
export default observer(SimManagementView)
