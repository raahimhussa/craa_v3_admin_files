import {
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
import { ClientUnitsButtons } from './ClientUnitsButtons'
import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import DeleteDialogue from '@components/DeleteDialogue/DeleteDialogue'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { VendorsButtons } from './VendorsButtons'
import compose from '@shopify/react-compose'
import { observer } from 'mobx-react'
import palette from 'src/theme/palette'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'
import withREST from 'src/hocs/withREST'

export const VendorsTable = compose<any>(
  withREST({
    collectionName: 'clientUnits',
    version: 1,
    path: (props) => {
      return `${props.clientUnit._id}/vendor`
    },
    propName: 'vendors',
  })
)(
  ({
    clientUnit,
    vendors,
    vendorsMutate,
    clientUnitsMutate,
    countries,
  }: {
    clientUnit: ClientUnit
    vendors: ClientUnit[]
    vendorsMutate: any
    clientUnitsMutate: any
    countries: any[]
  }) => {
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
        {/* <Box sx={{ mr: 2, mt: 2, mb: 1 }}>
          <Button variant="contained" sx={{ mr: 1, width: 48 }}>
            Add
          </Button>
          <Button variant="contained" sx={{ mr: 1, width: 48 }}>
            Delete
          </Button>
        </Box> */}
        <VendorsButtons vendor={clientUnit._id} mutate={vendorsMutate} />
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
            <TableCellHead justifyContent="start">Vendor name</TableCellHead>
            <TableCellHead width={168}>Auth Code</TableCellHead>
            <TableCellHead width={168}>Business Units</TableCellHead>
            <TableCellHead width={168} last>
              Actions
            </TableCellHead>
          </TableHead>
          <TableBody>
            {vendors.map((_vendor) => (
              <Row
                key={_vendor._id}
                clientUnit={_vendor}
                clientUnitsMutate={vendorsMutate}
                onHandleCheck={onHandleCheck}
                selectedRowIds={selectedRowIds}
                countries={countries}
              />
            ))}
            <TableRow>
              <TableCell colSpan={6} sx={{ height: 36 }} />
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    )
  }
)

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
      <TableRow sx={{ height: 36 }}>
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
    </>
  )
}
