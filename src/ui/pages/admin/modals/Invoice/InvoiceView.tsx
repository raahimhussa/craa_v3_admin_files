import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material'
import { Box, Checkbox, Select, TextField } from 'src/ui/core/components'
import { Button, FormLabel, Stack } from '@mui/material'
import { CalendarPicker, LocalizationProvider } from '@mui/x-date-pickers'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import DetailLayout from 'src/ui/layouts/DetailLayout/DetailLayout'
import Editor from 'src/ui/core/components/Editor/Editor'
import axios from 'axios'
import dayjs from 'dayjs'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import userAssessmentCycleStore from 'src/stores/userAssessmentCycleStore'

export enum AgreementKind {
  PrivacyPolicy = 'privacyPolicy',
  TermsOfService = 'termsOfService',
}
function InvoiceView(props: any) {
  const {
    userAssessmentCycleStore,
    uiState: { modal },
  } = useRootStore()
  const { enqueueSnackbar } = useSnackbar()
  const [invoicedDate, setInvoicedDate] = useState<Date>(
    new Date(
      new Date(
        new Date().setFullYear(
          new Date().getFullYear(),
          new Date().getMonth(),
          1
        )
      ).setHours(0, 0, 0, 0)
    )
  )
  const [currentView, setCurrentView] = useState<'year' | 'month'>('year')

  const onClickSave = async () => {
    try {
      await axios.patch('v1/userAssessmentCycles', {
        filter: { _id: props.selectedRowIds },
        update: { invoiced: true, invoicedDate: invoicedDate },
      })
      enqueueSnackbar('invoiced successfully', {
        variant: 'success',
      })
      props.userAssessmentCyclesMutate && props.userAssessmentCyclesMutate()
      props.countMutate && props.countMutate()
      userAssessmentCycleStore.invoicedMutate &&
        userAssessmentCycleStore.invoicedMutate()
      userAssessmentCycleStore.invoicedCountMutate &&
        userAssessmentCycleStore.invoicedCountMutate()
    } catch (e) {
      console.error(e)
      enqueueSnackbar('invoiced failed', { variant: 'error' })
    }
    modal.close()
  }

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        width: '400px',
        height: '500px',
        padding: '24px',
        transform: 'translate(-50%, -50%)',
        borderRadius: '10px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0px 24px 12px 24px',
        }}
      >
        <Box>
          <Button
            disabled={currentView === 'year'}
            onClick={() => setCurrentView('year')}
          >
            <ArrowBackIos />
          </Button>
          <Button
            disabled={currentView === 'month'}
            onClick={() => setCurrentView('month')}
          >
            <ArrowForwardIos />
          </Button>
        </Box>
        <Button
          disabled={!invoicedDate}
          variant="contained"
          onClick={onClickSave}
        >
          Save
        </Button>
      </Box>
      {/* @ts-ignore */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CalendarPicker
          disablePast
          views={['month', 'year']}
          view={currentView}
          date={dayjs(invoicedDate)}
          onChange={(date, selectionState) => {
            if (!date) return
            setInvoicedDate(date.toDate())
          }}
          onYearChange={() => setCurrentView('month')}
        />
      </LocalizationProvider>
    </Box>
  )
}
export default observer(InvoiceView)
