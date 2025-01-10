import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'
import { ArrowBackIos, ArrowForwardIos, ArrowLeft } from '@mui/icons-material'
import { Box, Button, Checkbox, Modal } from '@mui/material'
import { CalendarPicker, LocalizationProvider } from '@mui/x-date-pickers'
import { useEffect, useState } from 'react'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { CellProps } from 'react-table'
import DeleteDialogue from '@components/DeleteDialogue/DeleteDialogue'
import { PickerSelectionState } from '@mui/x-date-pickers/internals/hooks/usePickerState'
import axios from 'axios'
import dayjs from 'dayjs'
import { highlightedText } from 'src/utils/highlightedText'
import moment from 'moment'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'

const withColumns = (WrappedComponent: any) =>
  observer(({ ...rest }) => {
    const { userAssessmentCycleStore } = useRootStore()
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
      userAssessmentCycleStore.invoicedMutate = rest.userAssessmentCyclesMutate
      userAssessmentCycleStore.invoicedCountMutate = rest.countMutate
    }, [rest.userAssessmentCyclesMutate])

    const mutate = async () => {
      rest.userAssessmentCyclesMutate && rest.userAssessmentCyclesMutate()
      rest.countMutate && rest.countMutate()
      userAssessmentCycleStore.notInvoicedMutate &&
        userAssessmentCycleStore.notInvoicedMutate()
      userAssessmentCycleStore.notInvoicedCountMutate &&
        userAssessmentCycleStore.notInvoicedCountMutate()
    }

    const columns: Array<AdminColumn> = [
      {
        Header: 'Client',
        accessor: 'clientUnit.name',
        type: Type.String,
        Cell: (cellProps: CellProps<any>) => {
          return highlightedText(cellProps.value, rest.searchString)
        },
      },
      {
        Header: 'Last Name',
        accessor: 'user.profile.lastName',
        type: Type.String,
        Cell: (cellProps: CellProps<any>) => {
          return highlightedText(cellProps.value, rest.searchString)
        },
      },
      {
        Header: 'First Name',
        accessor: 'user.profile.firstName',
        type: Type.String,
        Cell: (cellProps: CellProps<any>) => {
          return highlightedText(cellProps.value, rest.searchString)
        },
      },
      {
        Header: 'Email',
        accessor: 'user.email',
        type: Type.String,
        Cell: (cellProps: CellProps<any>) => {
          return highlightedText(cellProps.value, rest.searchString)
        },
      },
      {
        Header: 'Country',
        accessor: 'user.profile.countryId',
        Cell: (cellProps: CellProps<any>) => {
          const country = rest.countries?.find(
            (_country: any) =>
              _country._id === cellProps.row.original.user.profile.countryId
          )?.name
          return <Box>{country ? country : '-'}</Box>
        },
      },
      {
        Header: 'Status',
        accessor: 'user.isActivated',
        Cell: (cellProps: CellProps<any>) => {
          return (
            <Box>
              {cellProps.row.original.user.isActivated ? 'Active' : 'Inactive'}
            </Box>
          )
        },
      },
      {
        Header: 'Published Date',
        accessor: 'userBaseline.publishedAt',
        Cell: (cellProps: CellProps<any>) => {
          const publishedAt = cellProps.row.original.userBaseline.publishedAt
          return (
            <Box>
              {publishedAt ? moment(publishedAt).format('DD-MMM-YYYY') : '-'}
            </Box>
          )
        },
      },
      {
        Header: 'Invoiced Date',
        accessor: 'invoicedDate',
        Cell: (cellProps: CellProps<any>) => {
          const invoicedDate = cellProps.row.original.invoicedDate
          return (
            <Box>
              {invoicedDate ? moment(invoicedDate).format('DD-MMM-YYYY') : '-'}
            </Box>
          )
        },
      },
      {
        Header: '',
        accessor: 'invoiced',
        Cell: (cellProps: CellProps<any>) => {
          const [open, setOpen] = useState<boolean>(false)
          const [revokeDialogueOpen, setRevokeDialogueOpen] =
            useState<boolean>(false)
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
          const [currentView, setCurrentView] = useState<'year' | 'month'>(
            'year'
          )
          const userName = `${cellProps.row.original.user.profile.firstName} ${cellProps.row.original.user.profile.lastName}`
          const onClickRevoke = async (e: any) => {
            try {
              await axios.patch('v1/userAssessmentCycles', {
                filter: { _id: cellProps.row.original._id },
                update: { invoiced: false, invoicedDate: null },
              })
              enqueueSnackbar('invoice revoked successfully', {
                variant: 'success',
              })
              await mutate()
            } catch (e) {
              console.error(e)
              enqueueSnackbar('invoice revoked failed', { variant: 'error' })
            }
          }

          const onClickSave = async () => {
            try {
              await axios.patch('v1/userAssessmentCycles', {
                filter: { _id: cellProps.row.original._id },
                update: { invoicedDate: invoicedDate },
              })
              enqueueSnackbar('invoice revoked successfully', {
                variant: 'success',
              })
              await mutate()
            } catch (e) {
              console.error(e)
              enqueueSnackbar('invoice revoked failed', { variant: 'error' })
            }
          }

          return (
            <Box>
              <Button
                onClick={() => setRevokeDialogueOpen(true)}
                variant="contained"
                sx={{ mr: 1 }}
              >
                revoke
              </Button>
              <Button onClick={() => setOpen(true)} variant="contained">
                edit
              </Button>
              <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
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
              </Modal>
              <DeleteDialogue
                open={revokeDialogueOpen}
                handleClose={() => setRevokeDialogueOpen(false)}
                onDelete={onClickRevoke}
                title={`Are you sure you want to revoke the invoice of ${
                  userName
                    ? `"${
                        userName.length > 20
                          ? userName.substring(0, 20) + '...'
                          : userName
                      }"`
                    : 'this user'
                }?`}
                text={
                  "This item will be revoked permanently. You can't undo this action."
                }
                yesText={'Revoke'}
                noText={'Cancel'}
                disableSnackbar
              />
            </Box>
          )
        },
      },
    ]

    const meta = {
      columns,
    }

    return <WrappedComponent {...rest} {...meta} />
  })

export default withColumns
