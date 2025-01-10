import { AdminColumn, Type } from 'src/ui/core/components/DataGrid/DataGrid'
import { AppBar, Box, Button, Modal, Toolbar, Typography } from '@mui/material'
import compose, { WrappingFunction } from '@shopify/react-compose'
import { observer, useLocalObservable } from 'mobx-react'

import CellButtons from '@components/cells/CellButtons/CellButtons'
import CellDetailButton from '@components/cells/CellDetailButton/CellDetailButton'
import { CellProps } from 'react-table'
import EditUser from '@components/forms/EditUser/EditUser'
import Reporting from 'src/ui/pages/admin/Reporting/Reporting'
import User from 'src/models/user'
import moment from 'moment'
import { useRootStore } from 'src/stores'

const withColumns: WrappingFunction = (WrappedComponent) =>
  observer((props) => {
    const {
      uiState: { modal },
    } = useRootStore()
    const highlightedText = (text: any, query: any) => {
      if (query !== '' && text?.toString()?.toLowerCase()?.includes(query)) {
        const parts =
          text?.toString()?.split(new RegExp(`(${query})`, 'gi')) || []

        return (
          <>
            {parts.map((part: any, index: any) =>
              part.toLowerCase() === query.toLowerCase() ? (
                <mark key={index}>{part}</mark>
              ) : (
                part
              )
            )}
          </>
        )
      }

      return text
    }

    const columns: Array<AdminColumn> = [
      {
        Header: 'Last Name',
        accessor: 'profile.lastName',
        type: Type.String,
        width: 550,
        Cell: (cellProps: any) => {
          return cellProps.value !== undefined
            ? highlightedText(
                cellProps.value,
                props?.params?.options?.fields?.searchString || ''
              )
            : ''
        },
      },
      {
        Header: 'First Name',
        accessor: 'profile.firstName',
        type: Type.String,
        width: 550,
        Cell: (cellProps: any) => {
          return cellProps.value !== undefined
            ? highlightedText(
                cellProps.value,
                props?.params?.options?.fields?.searchString || ''
              )
            : ''
        },
      },
      {
        Header: 'Username',
        accessor: 'name',
        type: Type.String,
        width: 550,
        Cell: (cellProps: any) => {
          return cellProps.value !== undefined
            ? highlightedText(
                cellProps.value,
                props?.params?.options?.fields?.searchString || ''
              )
            : ''
        },
      },
      {
        Header: 'Email',
        accessor: 'email',
        type: Type.String,
        width: 550,
        Cell: (cellProps: any) => {
          return cellProps.value !== undefined
            ? highlightedText(
                cellProps.value,
                props?.params?.options?.fields?.searchString || ''
              )
            : ''
        },
      },
      {
        Header: 'Notes',
        type: Type.String,
        width: 1,
        Cell: observer((cellProps: CellProps<User>) => {
          const {
            uiState: { modal },
          } = useRootStore()
          const state = useLocalObservable(() => ({
            isOpen: false,
          }))

          let url = `http://localhost:4000/v3/excel/notes/${cellProps.row.original._id}`
          if (process.env.NODE_ENV === 'production') {
            url = `https://craa-api-dev-3.hoansoft.com/v3/excel/notes/${cellProps.row.original._id}`
          }
          return (
            <a className="link" href={url}>
              <Button
                variant="contained"
                sx={{
                  height: '28px',
                }}
              >
                Export
              </Button>
            </a>
          )
        }),
      },
      {
        Header: 'User Logs',
        type: Type.String,
        width: 1,
        Cell: observer((cellProps: CellProps<User>) => {
          const {
            uiState: { modal },
          } = useRootStore()
          const state = useLocalObservable(() => ({
            isOpen: false,
          }))

          let url = `http://localhost:4000/v3/excel/userLogs/${cellProps.row.original._id}`
          if (process.env.NODE_ENV === 'production') {
            url = `https://craa-api-dev-3.hoansoft.com/v3/excel/userLogs/${cellProps.row.original._id}`
          }

          return (
            <a className="link" href={url}>
              <Button
                variant="contained"
                sx={{
                  height: '28px',
                }}
              >
                Export
              </Button>
            </a>
          )
        }),
      },
      {
        Header: 'Training Logs',
        type: Type.String,
        width: 1,
        Cell: observer((cellProps: CellProps<User>) => {
          const {
            uiState: { modal },
          } = useRootStore()
          const state = useLocalObservable(() => ({
            isOpen: false,
          }))

          let url = `http://localhost:4000/v3/excel/trainingLogs/${cellProps.row.original._id}`
          if (process.env.NODE_ENV === 'production') {
            url = `https://craa-api-dev-3.hoansoft.com/v3/excel/trainingLogs/${cellProps.row.original._id}`
          }

          return (
            <a className="link" href={url}>
              <Button
                variant="contained"
                sx={{
                  height: '28px',
                }}
              >
                Export
              </Button>
            </a>
          )
        }),
      },
    ]

    const meta = {
      columns,
    }

    return <WrappedComponent {...props} {...meta} />
  })

export default withColumns

const UserReportingCardView = observer(
  (cellProps: CellProps<any> & { userId: string }) => {
    const state = useLocalObservable(() => ({
      isOpen: false,
    }))
    const onClcikReporting = () => {
      state.isOpen = true
    }

    const onClickClose = () => {
      state.isOpen = false
    }

    return (
      <>
        <Button variant="outlined" onClick={onClcikReporting}>
          UserCard
        </Button>
        <Modal open={state.isOpen}>
          <Box>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Reporting
                </Typography>
                <Button onClick={onClickClose} color="inherit">
                  Close
                </Button>
              </Toolbar>
            </AppBar>
            <Reporting userId={cellProps.row.original._id} />
          </Box>
        </Modal>
      </>
    )
  }
)

export const UserReportingCard = compose<any>()(UserReportingCardView)
