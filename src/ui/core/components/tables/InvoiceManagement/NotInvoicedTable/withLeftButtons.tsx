import * as moment from 'moment'
import * as xlsx from 'xlsx'

import { CalendarPicker, LocalizationProvider } from '@mui/x-date-pickers'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Invoice from 'src/ui/pages/admin/modals/Invoice/Invoice'
import { WrappingFunction } from '@shopify/react-compose'
import axios from 'axios'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'
import { useState } from 'react'

const withLeftButtons: WrappingFunction = (WrappedComponent) =>
  observer((props) => {
    const { state } = props
    const {
      modalStore,
      userAssessmentCycleStore,
      uiState: { modal },
    } = useRootStore()
    const { enqueueSnackbar } = useSnackbar()

    const leftButtons = [
      {
        title: 'Export',
        onClick: async () => {
          try {
            const { data } = await axios.get(
              'v1/userAssessmentCycles/userStatusManagement/excel',
              {
                params: {
                  filter: { isDeleted: false },
                  options: {
                    multi: true,
                    fields: {
                      status: 0,
                      result: 0,
                      verified: 0,
                      invoiced: 2,
                      minEffort: 0,
                      signOff: 0,
                      behavior: 0,
                    },
                    // comment: {
                    //   fromValue: fromValue?.toDate(),
                    //   toValue: toValue?.toDate(),
                    // },
                  },
                },
              }
            )
            const wb = xlsx.read(data, {
              type: 'binary',
            })
            xlsx.writeFile(
              wb,
              `notinvoiced-user-${moment(new Date()).format(
                'DD-MMM-YYYY'
              )}.xlsx`
            )
          } catch (e) {
            console.error(e)
          }
        },
        color: 'primary',
      },
      {
        title: 'Invoice',
        onClick: () => {
          const selectedRowIds = state.selectedRowIds

          if (selectedRowIds.length === 0) {
            enqueueSnackbar('Please select rows', { variant: 'warning' })
          } else {
            modal.open(
              'invoice',
              <Invoice {...props} selectedRowIds={selectedRowIds} />
            )
          }
        },
        color: 'primary',
      },
    ]

    return (
      <WrappedComponent {...props} leftButtons={leftButtons} state={state} />
    )
  })

export default withLeftButtons
