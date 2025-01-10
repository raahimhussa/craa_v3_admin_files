import { AdminColumn, Type } from 'src/ui/core/components/DataGrid/DataGrid'
import {
  AppBar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  Toolbar,
  Typography,
} from '@mui/material'
import compose, { WrappingFunction } from '@shopify/react-compose'
import { observer, useLocalObservable } from 'mobx-react'

import { AdminLogScreen } from 'src/utils/status'
import CellButtons from '@components/cells/CellButtons/CellButtons'
import CellDetailButton from '@components/cells/CellDetailButton/CellDetailButton'
import { CellProps } from 'react-table'
import EditUser from '@components/forms/EditUser/EditUser'
import { Loop } from '@mui/icons-material'
import Reporting from 'src/ui/pages/admin/Reporting/Reporting'
import Swal from 'sweetalert2'
import User from 'src/models/user'
import { highlightedText } from 'src/utils/highlightedText'
import moment from 'moment'
import palette from 'src/theme/palette'
import { useRootStore } from 'src/stores'

const withColumns: WrappingFunction = (WrappedComponent) =>
  observer((props) => {
    const {
      uiState: { modal },
      authStore,
    } = useRootStore()

    const columns: Array<AdminColumn> = [
      {
        Header: 'LastName',
        accessor: 'profile.firstName',
        type: Type.String,
        width: 150,
        Cell: (cellProps: CellProps<any>) => {
          return highlightedText(cellProps.value, props.searchString)
        },
      },
      {
        Header: 'FirstName',
        accessor: 'profile.lastName',
        type: Type.String,
        width: 150,
        Cell: (cellProps: CellProps<any>) => {
          return highlightedText(cellProps.value, props.searchString)
        },
      },
      {
        Header: 'Email',
        accessor: 'email',
        type: Type.String,
        width: 150,
        Cell: (cellProps: CellProps<any>) => {
          return highlightedText(cellProps.value, props.searchString)
        },
      },
      {
        Header: 'Country',
        accessor: 'country.name',
        type: Type.String,
        width: 150,
      },
      {
        Header: 'Initial',
        accessor: 'profile.initial',
        type: Type.String,
        width: 150,
        Cell: (cellProps: CellProps<any>) => {
          return highlightedText(cellProps.value, props.searchString)
        },
      },
      {
        Header: 'Username',
        accessor: 'name',
        type: Type.String,
        width: 150,
        Cell: (cellProps: CellProps<any>) => {
          return highlightedText(cellProps.value, props.searchString)
        },
      },
      {
        Header: 'Client',
        accessor: 'client.name',
        type: Type.String,
        width: 150,
      },
      // {
      //   Header: 'Manager',
      //   accessor: 'profile.authCode',
      //   type: Type.String,
      //   width: 150,
      // },
      {
        Header: 'Role',
        accessor: 'role.title',
        type: Type.String,
        width: 50,
        Cell: (cellProps: CellProps<any>) => {
          return highlightedText(cellProps.value, props.searchString)
        },
      },
      {
        Header: 'Account Created Date',
        accessor: 'createdAt',
        type: Type.String,
        width: 50,
        Cell: (props: any) => {
          return moment(props.value).format('DD-MMM-YYYY hh:mm:ss')
        },
      },
      {
        Header: 'Email Verification Date',
        accessor: 'emailVerification',
        type: Type.String,
        width: 150,
        Cell: (props: any) => {
          if (!props.value) return ''
          return moment(props.value).format('DD-MMM-YYYY hh:mm:ss')
        },
      },
      {
        Header: 'Status',
        accessor: 'profile.status',
        type: Type.String,
        width: 150,
        Cell: (props: any) => {
          return props.row.original.isActivated ? 'Active' : 'Inactive'
        },
      },
      // {
      //   Header: 'Online',
      //   accessor: 'status.online',
      //   type: Type.String,
      //   width: 150,
      //   Cell: (cellProps: any) => {
      //     return (
      //       <div>
      //         {cellProps.row.original.status?.online ? 'true' : 'false'}
      //       </div>
      //     )
      //   },
      // },
      {
        Header: 'Connection',
        type: Type.String,
        Cell: observer((cellProps: CellProps<User>) => {
          const {
            uiState: { modal },
          } = useRootStore()
          const state = useLocalObservable(() => ({
            isOpen: false,
          }))

          const onClickSwitch = () => {
            if (!cellProps.row.original.isActivated) {
              state.isOpen = false
              Swal.fire({
                title: 'Please activate the user first.',
                icon: 'error',
                heightAuto: false,
              })
              return
            }
            authStore.signInUser.usernameOrEmail = cellProps.row.original.email
            authStore.signInUser.password = cellProps.row.original.password
            authStore.signin()
          }

          return (
            <Box>
              <Button
                sx={{
                  height: '28px',
                  color: cellProps.row.original.status?.online
                    ? palette.light.button.green
                    : '#bfbfbf',
                  bgcolor: 'transparent',
                  minWidth: '10px',
                  width: '70px',
                  cursor: 'default',
                  '&:hover': {
                    bgcolor: 'transparent',
                  },
                }}
              >
                {cellProps.row.original.status?.online ? 'ONLINE' : 'OFFLINE'}
              </Button>
              <Button
                sx={{
                  minWidth: '10px',
                  p: 0,
                }}
                disabled={cellProps.row.original.status?.online}
                onClick={() => {
                  state.isOpen = true
                }}
              >
                <Loop />
              </Button>
              <Dialog
                open={state.isOpen}
                onClose={() => {
                  state.isOpen = false
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {'Do you want to switch to this user?'}
                </DialogTitle>
                <DialogContent sx={{ width: '500px' }}>
                  <DialogContentText id="alert-dialog-description">
                    <br />
                    Name :{' '}
                    {`${cellProps.row.original?.profile?.firstName} ${cellProps.row.original?.profile?.lastName}`}
                    <br />
                    {/* @ts-ignore */}
                    Role : {cellProps.row.original?.role?.title}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => {
                      state.isOpen = false
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={onClickSwitch} autoFocus>
                    Switch
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          )
        }),
      },
      {
        Header: 'Reporting',
        type: Type.String,
        Cell: observer((cellProps: CellProps<User>) => {
          const {
            uiState: { modal },
          } = useRootStore()
          const state = useLocalObservable(() => ({
            isOpen: false,
          }))
          const onClickReporting = () => {
            state.isOpen = true
            modal.payload = { user: cellProps.row.original }
          }

          const onClickClose = () => {
            modal.payload = {}
            state.isOpen = false
          }

          return (
            <Box>
              <Button
                variant="outlined"
                onClick={onClickReporting}
                sx={{
                  border: '1px solid rgb(84,91,100) !important',
                  color: 'rgb(84,91,100) !important',
                  height: '28px',
                }}
              >
                UserCard
              </Button>
              <Modal open={state.isOpen}>
                <Box>
                  <AppBar position="static">
                    <Toolbar>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                      >
                        Reporting
                      </Typography>
                      <Button onClick={onClickClose} color="inherit">
                        Close
                      </Button>
                    </Toolbar>
                  </AppBar>
                  <Reporting userId={cellProps.row.original._id.toString()} />
                </Box>
              </Modal>
            </Box>
          )
        }),
      },
      {
        Header: 'actions',
        storeKey: 'userStore',
        Cell: CellButtons,
        screen: AdminLogScreen.UserManagement,
        minWidth: 150,
        mutateKey: 'users',
        mutate: async () => {
          props.usersMutate && (await props.usersMutate())
          props.countMutate && (await props.countMutate())
        },
        edit: (cellProps: any) => {
          modal.open('Users', <EditUser usersMutate={props.usersMutate} />)
        },
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
