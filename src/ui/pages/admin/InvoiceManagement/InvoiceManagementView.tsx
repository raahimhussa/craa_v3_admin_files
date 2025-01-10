import * as xlsx from 'xlsx'

import {
  Box,
  Button,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material'
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { JSXElementConstructor, ReactElement, useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import InvoicedTable from '@components/tables/InvoiceManagement/InvoicedTable/InvoicedTable'
import NotInvoicedTable from '@components/tables/InvoiceManagement/NotInvoicedTable/NotInvoicedTable'
import PaginationTable from 'src/ui/components/PaginationTable'
import SearchBar from './SearchBar/SearchBar'
import axios from 'axios'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'

function InvoiceManagementView(props: any) {
  const { userAssessmentCycleStore } = useRootStore()
  const [fromValue, setFromValue] = useState<Dayjs | null>(null)
  const [toValue, setToValue] = useState<Dayjs | null>(null)
  const [notInvoicedSearchString, setNotInvoicedSearchString] =
    useState<string>('')
  const [invoicedSearchString, setInvoicedSearchString] = useState<string>('')

  const handleChangeFromValue = (newValue: Dayjs | null) => {
    if (!newValue) return
    if (toValue && newValue > toValue) return
    setFromValue(newValue)
  }
  const handleChangeToValue = (newValue: Dayjs | null) => {
    if (!newValue) return
    if (fromValue && fromValue > newValue) return
    setToValue(newValue)
  }
  const onClickReset = () => {
    setFromValue(null)
    setToValue(null)
  }

  useEffect(() => {
    userAssessmentCycleStore.invoicedFromValue = fromValue
    userAssessmentCycleStore.invoicedToValue = toValue
  }, [fromValue, toValue])

  const getInvoicedDate = () => {
    const ret: any = {}
    if (fromValue?.toDate()) {
      ret['$gte'] = new Date(fromValue.toDate())
    }
    if (toValue?.toDate()) {
      ret['$lte'] = new Date(toValue.toDate())
    }
    if (!fromValue?.toDate() && !toValue?.toDate()) {
      return undefined
    }
    return ret
  }

  const notInvoicedSearchStringFilter = {
    $or: [
      {
        'user.profile.firstName': {
          $regex: notInvoicedSearchString,
          $options: 'i',
        },
      },
      {
        'user.profile.lastName': {
          $regex: notInvoicedSearchString,
          $options: 'i',
        },
      },
      { 'clientUnit.name': { $regex: notInvoicedSearchString, $options: 'i' } },
      { 'user.email': { $regex: notInvoicedSearchString, $options: 'i' } },
      { grade: { $regex: notInvoicedSearchString, $options: 'i' } },
    ],
  }

  const invoicedSearchStringFilter = {
    $or: [
      {
        'user.profile.firstName': {
          $regex: invoicedSearchString,
          $options: 'i',
        },
      },
      {
        'user.profile.lastName': {
          $regex: invoicedSearchString,
          $options: 'i',
        },
      },
      { 'clientUnit.name': { $regex: invoicedSearchString, $options: 'i' } },
      { 'user.email': { $regex: invoicedSearchString, $options: 'i' } },
      { grade: { $regex: invoicedSearchString, $options: 'i' } },
    ],
  }

  return (
    <Box
    // sx={{ height: 'calc(100vh - 120px)', overflow: 'auto' }}
    >
      <Box sx={{ position: 'relative' }}>
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
            searchString={notInvoicedSearchString}
            onChange={(e: any) => setNotInvoicedSearchString(e.target.value)}
          />
        </Box>
        <PaginationTable
          collectionName={'invoiceManagement'}
          Table={NotInvoicedTable}
          params={{
            filter: {
              isDeleted: false,
              invoiced: false,
              ...notInvoicedSearchStringFilter,
            },
          }}
          version={3}
          height={'calc(50vh - 200px)'}
          searchString={notInvoicedSearchString}
        />
      </Box>
      <Box sx={{ position: 'relative' }}>
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
            searchString={invoicedSearchString}
            onChange={(e: any) => setInvoicedSearchString(e.target.value)}
          />
        </Box>
        <Box
          sx={{
            zIndex: 1000,
            position: 'absolute',
            left: '50%',
            transform: 'translate(-50%,0)',
            marginTop: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '524px',
            backgroundColor: 'white',
            padding: '4px 16px',
            borderRadius: '8px',
          }}
        >
          <Typography>Invoiced from</Typography>
          {/* @ts-ignore */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              views={['year', 'month']}
              inputFormat="MMM YYYY"
              value={fromValue}
              onChange={handleChangeFromValue}
              renderInput={(params) => {
                return (
                  <TextField
                    {...params}
                    sx={{
                      width: '140px',
                      '& input': {
                        fontSize: '13px!important',
                      },
                    }}
                    size="small"
                  />
                )
              }}
            />
            <Typography>to</Typography>
            <DesktopDatePicker
              views={['year', 'month']}
              inputFormat="MMM YYYY"
              value={toValue}
              onChange={handleChangeToValue}
              renderInput={(params) => {
                return (
                  <TextField
                    {...params}
                    sx={{
                      width: '140px',
                      '& input': {
                        fontSize: '13px!important',
                      },
                    }}
                    size="small"
                  />
                )
              }}
            />
          </LocalizationProvider>
          <Button
            variant="contained"
            size="small"
            sx={{ ml: 1 }}
            onClick={onClickReset}
          >
            Reset
          </Button>
        </Box>

        <PaginationTable
          collectionName={'invoiceManagement'}
          Table={InvoicedTable}
          params={{
            filter: {
              isDeleted: false,
              invoiced: true,
              invoicedDate: getInvoicedDate(),
              ...invoicedSearchStringFilter,
            },
          }}
          version={3}
          height={'calc(50vh - 200px)'}
          searchString={invoicedSearchString}
        />
      </Box>
    </Box>
  )
}
export default observer(InvoiceManagementView)
