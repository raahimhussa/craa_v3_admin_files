import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Collapse,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import {
  BusinessUnit,
  ClientUnit,
} from 'src/models/clientUnit/clientUnit.interface'
import { Delete, Edit, Remove } from '@mui/icons-material'
import { TableCellHead, TableCellHeadStart } from './components'
import { useEffect, useState } from 'react'

import { BusinessUnitTable } from './BusinessUnitsTable'
import Client from 'src/ui/pages/admin/Client/Client'
import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import DeleteDialogue from '@components/DeleteDialogue/DeleteDialogue'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { VendorsTable } from './VendorsTable'
import { observer } from 'mobx-react'
import palette from 'src/theme/palette'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'

function ClientUnitsTable({
  clientUnits,
  clientUnitsMutate,
  countries,
}: {
  clientUnits: ClientUnit[]
  clientUnitsMutate: any
  countries: any[]
}) {
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])

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
      setSelectedRowIds(clientUnits.map((_clientUnit) => _clientUnit._id))
    } else {
      setSelectedRowIds([])
    }
  }

  return (
    <Box
      sx={{
        height: 'calc(100vh - 218px)',
        overflow: 'auto',
      }}
    >
      <Table stickyHeader>
        <TableHead sx={{ height: 48 }}>
          <TableCellHeadStart width={72}>
            <Checkbox
              onChange={onHandleCheckAll}
              checked={
                clientUnits.length === selectedRowIds.length &&
                selectedRowIds.length !== 0
              }
            />
          </TableCellHeadStart>
          <TableCellHead justifyContent="start">Client Name</TableCellHead>
          <TableCellHead width={168}>Auth Code</TableCellHead>
          <TableCellHead width={168}>Business Units</TableCellHead>
          <TableCellHead width={168}>Vendors</TableCellHead>
          <TableCellHead width={168} last>
            Actions
          </TableCellHead>
        </TableHead>
        <TableBody sx={{ height: '100%' }}>
          {clientUnits
            .filter((client) => client.vendor === '')
            .map((_clientUnit) => {
              return (
                <Row
                  clientUnit={_clientUnit}
                  clientUnitsMutate={clientUnitsMutate}
                  onHandleCheck={onHandleCheck}
                  selectedRowIds={selectedRowIds}
                  countries={countries}
                />
              )
            })}
        </TableBody>
      </Table>
    </Box>
  )
}
export default observer(ClientUnitsTable)

const Row = ({
  clientUnit,
  clientUnitsMutate,
  onHandleCheck,
  selectedRowIds,
  countries,
}: {
  clientUnit: ClientUnit
  clientUnitsMutate: any
  onHandleCheck: (e: any, clientUnitId: string) => void
  selectedRowIds: string[]
  countries: any[]
}) => {
  const [deleteDialogueOpen, setDeleteDialogueOpen] = useState<boolean>(false)
  const [businessUnitsTableOpen, setBusinessUnitsTableOpen] =
    useState<boolean>(false)
  const [vendorsTableOpen, setVendorsTableOpen] = useState<boolean>(false)
  const { enqueueSnackbar } = useSnackbar()

  const {
    clientUnitStore,
    uiState: { modal },
  } = useRootStore()

  const handleDeleteDialogueOpen = () => {
    setDeleteDialogueOpen(true)
  }

  const handleDeleteDialogueClose = () => {
    setDeleteDialogueOpen(false)
  }

  const handleBusinessUnitsTableOpen = () => {
    setBusinessUnitsTableOpen((prev) => !prev)
  }

  const handleVendorsTableOpen = () => {
    setVendorsTableOpen((prev) => !prev)
  }

  const onClickEdit = () => {
    clientUnitStore.form = clientUnit
    clientUnitStore.mutate = clientUnitsMutate
    modal.open('Client', <Client />)
  }

  const onClickDelete = async () => {
    try {
      clientUnitStore.form = clientUnit
      await clientUnitStore.delete()

      clientUnitsMutate && (await clientUnitsMutate())
    } catch (error) {
      throw error
    }
  }

  const copyAuthCode = () => {
    navigator.clipboard.writeText(clientUnit.authCode)
    enqueueSnackbar('Auth code copied', { variant: 'info' })
  }

  return (
    <>
      <TableRow sx={{ height: 48 }}>
        <TableCell>
          <Checkbox
            onChange={(e) => onHandleCheck(e, clientUnit._id)}
            checked={selectedRowIds.includes(clientUnit._id)}
          />
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', justifyContent: 'start' }}>
            {clientUnit.name}
          </Box>
        </TableCell>
        <TableCell>
          <Box
            sx={{ display: 'flex', justifyContent: 'center' }}
            onClick={copyAuthCode}
          >
            <Button>{clientUnit.authCode}</Button>
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={handleBusinessUnitsTableOpen}
            >
              {businessUnitsTableOpen ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={handleVendorsTableOpen}
            >
              {vendorsTableOpen ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
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
            title={`Are you sure you want to delete ${clientUnit.name}?`}
            text={
              "This item will be deleted permanently. You can't undo this action."
            }
            yesText={'Delete'}
            noText={'Cancel'}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          colSpan={6}
          sx={{
            backgroundColor: 'white',
            borderLeft: '48px solid #eeeeee',
            paddingLeft: '0px !important',
            // borderRight: '4px solid grey',
          }}
        >
          <Collapse in={businessUnitsTableOpen} timeout="auto" unmountOnExit>
            <BusinessUnitTable
              clientUnit={clientUnit}
              clientUnitsMutate={clientUnitsMutate}
              countries={countries}
            />
          </Collapse>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          colSpan={6}
          sx={{
            backgroundColor: 'white',
            borderLeft: '48px solid #eeeeee',
            paddingLeft: '0px !important',
            // borderRight: '4px solid grey',
          }}
        >
          <Collapse in={vendorsTableOpen} timeout="auto" unmountOnExit>
            <VendorsTable
              clientUnit={clientUnit}
              clientUnitsMutate={clientUnitsMutate}
              countries={countries}
            />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}
