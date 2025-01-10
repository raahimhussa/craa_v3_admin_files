import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material'
import {
  ClientUnit,
  BusinessUnit as IBusinessUnit,
} from 'src/models/clientUnit/clientUnit.interface'
import { Delete, Edit, Remove } from '@mui/icons-material'
import { TableCellHead, TableCellHeadStart } from './components'
import { useEffect, useState } from 'react'

import BusinessUnit from 'src/ui/pages/admin/BusinessUnit/BusinessUnit'
import Client from 'src/ui/pages/admin/Client/Client'
import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import DeleteDialogue from '@components/DeleteDialogue/DeleteDialogue'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { UpdateType } from 'src/stores/clientUnitStore'
import axios from 'axios'
import { observer } from 'mobx-react'
import palette from 'src/theme/palette'
import { toJS } from 'mobx'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'

export const BusinessUnitTable = ({
  clientUnit,
  clientUnitsMutate,
  countries,
}: {
  clientUnit: ClientUnit
  clientUnitsMutate: any
  countries: any[]
}) => {
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])

  const {
    clientUnitStore,
    uiState: { modal },
  } = useRootStore()

  const onClickAdd = () => {
    clientUnitStore.form = clientUnit
    clientUnitStore.resetBusinessUnitForm()
    clientUnitStore.addBusinessUnit()
    clientUnitStore.updateType = UpdateType.BusinessUnit
    clientUnitStore.mutate = clientUnitsMutate
    modal.open('BusinessUnit', <BusinessUnit />)
  }

  const onClickDelete = () => {}

  const onHandleCheck = (e: any, rowId: string) => {
    const check = e.target.checked
    if (check) {
      setSelectedRowIds((prev) => {
        if ([...prev].find((_id) => _id === rowId)) {
          return [...prev].filter((_id) => _id !== rowId)
        } else {
          return [...prev, rowId]
        }
      })
    } else {
      setSelectedRowIds([])
    }
  }

  const onHandleCheckAll = (e: any) => {
    const check = e.target.checked
    if (check) {
      setSelectedRowIds(
        clientUnit.businessUnits.map((_businessUnit) => _businessUnit._id)
      )
    } else {
      setSelectedRowIds([])
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'end',
        // ml: 2,
        mr: 2,
      }}
    >
      <Box sx={{ mr: 2, mt: 2, mb: 1 }}>
        <Button
          variant="contained"
          sx={{ mr: 1, width: 48 }}
          onClick={onClickAdd}
        >
          Add
        </Button>
        <Button
          variant="contained"
          sx={{ mr: 1, width: 48 }}
          onClick={onClickDelete}
        >
          Delete
        </Button>
      </Box>
      <Table>
        <TableHead sx={{ height: 36 }}>
          <TableCellHeadStart width={72}>
            <Checkbox
              onChange={onHandleCheckAll}
              checked={
                clientUnit.businessUnits.length === selectedRowIds.length &&
                selectedRowIds.length !== 0
              }
            />
          </TableCellHeadStart>
          <TableCellHead justifyContent="start">
            Business Unit name
          </TableCellHead>
          <TableCellHead width={278}>Country Business Unit</TableCellHead>
          <TableCellHead width={278}>Country Permission</TableCellHead>
          <TableCellHead width={168} last>
            Actions
          </TableCellHead>
        </TableHead>
        <TableBody>
          {clientUnit.businessUnits.map((_businessUnit, index) => {
            return (
              <Row
                clientUnit={clientUnit}
                businessUnit={_businessUnit}
                index={index}
                clientUnitsMutate={clientUnitsMutate}
                onHandleCheck={onHandleCheck}
                selectedRowIds={selectedRowIds}
                countries={countries}
              />
            )
          })}
          <TableRow>
            <TableCell colSpan={6} sx={{ height: 36 }} />
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  )
}

const Row = ({
  clientUnit,
  businessUnit,
  index,
  clientUnitsMutate,
  onHandleCheck,
  selectedRowIds,
  countries,
}: {
  clientUnit: ClientUnit
  businessUnit: IBusinessUnit
  index: number
  clientUnitsMutate: any
  onHandleCheck: (e: any, businessUnitId: string) => void
  selectedRowIds: string[]
  countries: any[]
}) => {
  const [deleteDialogueOpen, setDeleteDialogueOpen] = useState<boolean>(false)
  const { enqueueSnackbar } = useSnackbar()

  const {
    clientUnitStore,
    uiState: { modal },
  } = useRootStore()

  const countryOptions =
    countries?.map((_country) => ({
      text: _country.name,
      value: _country._id,
      object: _country,
    })) || []

  const handleDeleteDialogueOpen = () => {
    setDeleteDialogueOpen(true)
  }

  const handleDeleteDialogueClose = () => {
    setDeleteDialogueOpen(false)
  }

  const onClickEdit = () => {
    clientUnitStore.form = clientUnit
    clientUnitStore.businessUnitForm = businessUnit
    clientUnitStore.updateType = UpdateType.BusinessUnit
    clientUnitStore.mutate = clientUnitsMutate
    modal.open('BusinessUnit', <BusinessUnit />)
  }

  const onClickDelete = async () => {
    await axios.delete(`v1/clientUnits/${clientUnit._id}/${businessUnit._id}`)
    clientUnitsMutate && (await clientUnitsMutate())
  }

  const getOptionLabel = (option: any) => {
    return option.text
  }

  return (
    <TableRow sx={{ height: 36 }}>
      <TableCell>
        <Checkbox
          onChange={(e) => onHandleCheck(e, businessUnit._id)}
          checked={selectedRowIds.includes(businessUnit._id)}
        />
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', justifyContent: 'start' }}>
          {businessUnit.name}
        </Box>
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Autocomplete
            sx={{ width: '100%' }}
            onChange={() => {}}
            limitTags={1}
            options={countryOptions.filter((_countryOption) =>
              businessUnit.countryIds.includes(_countryOption.value)
            )}
            ChipProps={{
              sx: {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                // '&.MuiChip-root': {
                //   height: '22.5px !important',
                //   margin: '0 !important',
                // },
              },
            }}
            multiple
            value={countryOptions.filter((_countryOption) =>
              businessUnit.countryIds.includes(_countryOption.value)
            )}
            getOptionLabel={getOptionLabel}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                // variant={'outlined'}
                InputProps={{
                  ...params.InputProps,
                  sx: {
                    '&.MuiInputBase-root': {
                      minHeight: 37.13,
                      overflow: 'hidden',
                      height: '100%',
                    },
                  },
                }}
              />
            )}
          />
        </Box>
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Autocomplete
            sx={{ width: '100%' }}
            onChange={() => {}}
            limitTags={1}
            options={countryOptions.filter((_countryOption) =>
              businessUnit.adminCountryIds.includes(_countryOption.value)
            )}
            ChipProps={{
              sx: {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                // '&.MuiChip-root': {
                //   height: '22.5px !important',
                //   margin: '0 !important',
                // },
              },
            }}
            multiple
            value={countryOptions.filter((_countryOption) =>
              businessUnit.adminCountryIds.includes(_countryOption.value)
            )}
            getOptionLabel={getOptionLabel}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                // variant={'outlined'}
                InputProps={{
                  ...params.InputProps,
                  sx: {
                    '&.MuiInputBase-root': {
                      minHeight: 37.13,
                      overflow: 'hidden',
                      height: '100%',
                    },
                  },
                }}
              />
            )}
          />
        </Box>
      </TableCell>
      <TableCell>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ButtonGroup>
            <IconButton onClick={onClickEdit}>
              <Edit htmlColor={palette.light.button.blue} />
            </IconButton>
            <IconButton onClick={handleDeleteDialogueOpen}>
              <Delete htmlColor={palette.light.button.red} />
            </IconButton>
          </ButtonGroup>
        </Box>
        <DeleteDialogue
          open={deleteDialogueOpen}
          handleClose={handleDeleteDialogueClose}
          onDelete={onClickDelete}
          title={`Are you sure you want to delete ${businessUnit.name}?`}
          text={
            "This item will be deleted permanently. You can't undo this action."
          }
          yesText={'Delete'}
          noText={'Cancel'}
        />
      </TableCell>
    </TableRow>
  )
}
