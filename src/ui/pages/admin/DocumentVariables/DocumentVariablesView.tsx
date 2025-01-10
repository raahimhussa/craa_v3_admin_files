import { observer, useLocalObservable } from 'mobx-react'

import { Box, Button, MenuItem, Select } from '@mui/material'
import Files from 'src/ui/core/components/tables/Files/Files'
import PaginationTable from 'src/ui/components/PaginationTable'
import SearchBar from './SearchBar/SearchBar'
import SimulationSelect from './SimulationSelect/SimulationSelect'
import { Suspense, useEffect, useState } from 'react'
import DocumentVariables from '@components/tables/DocumentVariables/DocumentVariables'
import DocumentVariableGroup from 'src/models/documentVariableGroup'
import { useRootStore } from 'src/stores'
import { ReactSpreadsheetImport } from 'react-spreadsheet-import'

function DocumentVariablesView() {
  const { documentVariableGroupStore } = useRootStore()
  const [groupId, setGroupId] = useState<string | undefined>(undefined)
  const [searchString, setSearchString] = useState<string>('')
  const [groups, setGroups] = useState<DocumentVariableGroup[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const fields = [
    {
      // Visible in table header and when matching columns.
      label: 'Key',
      key: 'key',
      // Used when editing and validating information.
      fieldType: {
        // There are 3 types - "input" / "checkbox" / "select".
        type: 'input',
      },
    },
    {
      // Visible in table header and when matching columns.
      label: 'Value',
      key: 'Value',
      // Used when editing and validating information.
      fieldType: {
        // There are 3 types - "input" / "checkbox" / "select".
        type: 'input',
      },
    },
  ]

  const getGroups = async () => {
    const { data } =
      await documentVariableGroupStore.documentVariableGroupRepository.find({
        filter: {
          isDeleted: false,
        },
      })
    setGroups(data)
  }

  useEffect(() => {
    getGroups()
  }, [])

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'white',
          position: 'absolute',
          left: '16px',
          // transform: 'translate(-50%, 0%)',
          mt: 2,
          zIndex: 100,
        }}
      >
        <Select
          onChange={(e: any) => {
            setGroupId(e.target.value)
          }}
          sx={{
            width: '300px',
            height: '37px',
            mr: 1,
          }}
        >
          {groups.map((group: DocumentVariableGroup) => (
            <MenuItem value={group._id}>{group.name}</MenuItem>
          ))}
        </Select>
        <SearchBar
          searchString={searchString}
          onChange={(e: any) => setSearchString(e.target.value)}
        />
      </Box>
      <PaginationTable
        collectionName="documentVariables"
        Table={DocumentVariables}
        version={1}
        params={{
          filter: {
            isDeleted: false,
            groupId: groupId,
          },
          options: { fields: { searchString } },
        }}
      />
    </>
  )
}
export default observer(DocumentVariablesView)
