import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'
import { AppBar, Box, Button, Modal, Toolbar, Typography } from '@mui/material'
import { observer, useLocalObservable } from 'mobx-react'

import BadgeIcon from '@mui/icons-material/Badge'
import CellButtons from 'src/ui/core/components/cells/CellButtons/CellButtons'
import { CellProps } from 'react-table'
import DehazeIcon from '@mui/icons-material/Dehaze'
import Loadmap from 'src/ui/pages/admin/Loadmap/Loadmap'
import ReallocateDialogue from '@components/ReallocateDialogue/ReallocateDialogue'
import ReopenDialogue from '@components/ReopenDialogue/ReopenDialogue'
import Reporting from 'src/ui/pages/admin/Reporting/Reporting'
import ScreenRecords from '@components/tables/ScreenRecords/ScreenRecords'
import Simulation from 'src/models/simulation'
import User from 'src/models/user'
import UserSimulation from 'src/models/userSimulation'
import { UserSimulationStatus } from 'src/utils/status'
import { WrappingFunction } from '@shopify/react-compose'
import axios from 'axios'
import moment from 'moment'
import palette from 'src/theme/palette'
import { useRootStore } from 'src/stores'

const withColumns: WrappingFunction = (WrappedComponent) =>
  observer((props) => {
    const {
      uiState: { modal, simulations },
    } = useRootStore()
    const columns: Array<AdminColumn> = [
      {
        Header: 'Simulation',
        accessor: 'simulation.name',
        minWidth: 200,
        type: Type.String,
      },
      {
        Header: 'Allocated Time',
        accessor: 'testTime',
        minWidth: 200,
        type: Type.String,
        Cell: (cellProps: CellProps<UserSimulation>) => {
          const userFollowup = cellProps.row.original
          const testTime = userFollowup.testTime
          if (!testTime) return '-'
          const hours = Math.floor(testTime / (60 * 60))
          const mins = Math.floor((testTime - hours * 60 * 60) / 60)
          const secs = testTime - hours * 60 * 60 - mins * 60

          return `${hours.toString().padStart(2, '0')}:${mins
            .toString()
            .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        },
      },
      {
        Header: 'Time Spent',
        accessor: 'usageTime',
        minWidth: 200,
        type: Type.String,
        Cell: (cellProps: CellProps<UserSimulation>) => {
          const userFollowup = cellProps.row.original
          const usageTime = userFollowup.usageTime
          if (!usageTime) return '-'
          const hours = Math.floor(usageTime / (60 * 60))
          const mins = Math.floor((usageTime - hours * 60 * 60) / 60)
          const secs = usageTime - hours * 60 * 60 - mins * 60

          return `${hours.toString().padStart(2, '0')}:${mins
            .toString()
            .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        },
      },
      {
        Header: 'Session Count',
        accessor: 'attemptCount',
        minWidth: 200,
        type: Type.String,
      },
      {
        Header: 'Date Assigned',
        accessor: 'assignedAt',
        cellType: CellType.Date,
        minWidth: 200,
        Cell: (cellProps: CellProps<UserSimulation>) => {
          const userFollowup = cellProps.row.original
          return (
            <Box>
              {userFollowup.assignedAt
                ? moment(userFollowup.assignedAt).format('DD-MMM-yyyy hh:mm:ss')
                : '-'}
            </Box>
          )
        },
      },
      {
        Header: 'Submit Date',
        accessor: '',
        cellType: CellType.Date,
        minWidth: 200,
        Cell: (cellProps: CellProps<UserSimulation>) => {
          const userFollowup = cellProps.row.original
          return (
            <Box>
              {userFollowup.submittedAt
                ? moment(userFollowup.submittedAt).format(
                    'DD-MMM-yyyy hh:mm:ss'
                  )
                : '-'}
            </Box>
          )
        },
      },
      {
        Header: 'Publish Date',
        accessor: 'updatedAt',
        cellType: CellType.Date,
        minWidth: 200,
        Cell: (cellProps: CellProps<UserSimulation>) => {
          const userFollowup = cellProps.row.original
          return (
            <Box>
              {userFollowup.publishedAt
                ? moment(userFollowup.publishedAt).format(
                    'DD-MMM-yyyy hh:mm:ss'
                  )
                : '-'}
            </Box>
          )
        },
      },
      {
        Header: 'Sim Stauts',
        accessor: 'status',
        minWidth: 200,
        type: Type.String,
      },
      {
        Header: 'Result Stage',
        accessor: '',
        minWidth: 200,
        type: Type.String,
      },
      // {
      //   Header: 'Reopen',
      //   type: Type.String,
      //   Cell: observer((cellProps: CellProps<any>) => {
      //     const state = useLocalObservable(() => ({
      //       isOpen: false,
      //     }))
      //     const user = props.user as User
      //     const userFollowup = cellProps.row.original as UserSimulation
      //     const simulation = cellProps.row.original.simulation as Simulation
      //     const simManagementMutate = props.simManagementMutate
      //     const countMutate = props.countMutate

      //     const onClickReopen = async () => {
      //       await axios.post(
      //         `v3/simManagement/userSimulations/${userFollowup._id}/reopen`
      //       )
      //       simManagementMutate && (await simManagementMutate())
      //       countMutate && (await countMutate())
      //     }

      //     const onClickOpen = () => {
      //       state.isOpen = true
      //     }

      //     const onHandleClose = () => {
      //       state.isOpen = false
      //     }

      //     if (
      //       userFollowup?.status === UserSimulationStatus.HasNotAssigned ||
      //       userFollowup?.status === UserSimulationStatus.Assigned ||
      //       userFollowup?.status === UserSimulationStatus.InProgress
      //     ) {
      //       return null
      //     }

      //     return (
      //       <Box>
      //         <Button
      //           variant="outlined"
      //           onClick={onClickOpen}
      //           sx={{
      //             border: '1px solid rgb(84,91,100) !important',
      //             color: 'rgb(84,91,100) !important',
      //             height: '28px',
      //           }}
      //         >
      //           Reopen
      //         </Button>
      //         <ReopenDialogue
      //           open={state.isOpen}
      //           handleClose={onHandleClose}
      //           onReopen={onClickReopen}
      //           title={`Are you sure you want to reopen this ${userFollowup.simulationType} simulation?
      //           (${simulation.label} - ${user.name})`}
      //           text={
      //             "This simulation will be reopened permanently. You can't undo this action."
      //           }
      //           yesText={'Reopen'}
      //           noText={'Cancel'}
      //         />
      //       </Box>
      //     )
      //   }),
      // },
      {
        Header: 'Screen Logs',
        // accessor: 'status.logoutAt',
        type: Type.String,
        width: 150,
        Cell: observer((props: CellProps<any>) => {
          const onClickScreenLog = () => {
            modal.open(
              'S',
              <ScreenRecords userSimulationId={props.row.original._id} />
            )
          }

          return (
            <Button
              variant="outlined"
              onClick={onClickScreenLog}
              disabled={
                props.row.original.status == 'hasNotAssigned' ||
                props.row.original.status == 'Assigned'
              }
            >
              Screen Log
            </Button>
          )
        }),
      },
      {
        Header: ' ',
        type: Type.String,
        Cell: observer((cellProps: CellProps<any>) => {
          const userFollowup = cellProps.row.original

          const usageTime =
            Math.floor((userFollowup.usageTime * 10) / (60 * 60)) / 10
          const testTime =
            Math.floor((userFollowup.testTime * 10) / (60 * 60)) / 10
          const attemptCount = userFollowup.attemptCount

          const {
            uiState: { modal },
          } = useRootStore()

          const state = useLocalObservable(() => ({
            isUserCardOpen: false,
            isLoadMapOpen: false,
            isReOpen: false,
            isSettingOpen: false,
          }))

          const onClickLoadmap = () => {
            state.isLoadMapOpen = true
            modal.payload = { user: cellProps.row.original }
          }

          const onClickLoadmapClose = () => {
            modal.payload = {}
            state.isLoadMapOpen = false
          }

          const onClickSetting = async (
            additionalTestTime: number,
            additionalAttemptCount: number
          ) => {
            await axios.post(
              `v3/simManagement/userSimulations/${userFollowup._id}/reallocate`,
              {
                additionalTestTime,
                additionalAttemptCount,
              }
            )
            props.simManagementMutate && (await props.simManagementMutate())
            props.countMutate && (await props.countMutate())
          }

          const onClickSettingModal = () => {
            state.isSettingOpen = true
          }

          const onHandleSettingClose = () => {
            state.isSettingOpen = false
          }

          return (
            <Box>
              <Button
                variant="contained"
                onClick={onClickLoadmap}
                sx={{
                  // border: '1px solid rgb(84,91,100) !important',
                  // color: 'rgb(84,91,100) !important',
                  height: '28px',
                  mr: 0.5,
                  px: '0 !important',
                  minWidth: '30px !important',
                }}
              >
                <DehazeIcon />
              </Button>
              <Button
                variant="contained"
                onClick={onClickSettingModal}
                sx={{
                  // border: '1px solid rgb(84,91,100) !important',
                  // color: 'rgb(84,91,100) !important',
                  height: '28px',
                  px: '0 !important',
                  bgcolor: palette.light.button.blue,
                  fontWeight: 600,
                  fontSize: '13px',
                  mr: 1,
                }}
              >
                Setting
              </Button>
              <Modal open={state.isLoadMapOpen}>
                <Box>
                  <AppBar position="static">
                    <Toolbar>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                      >
                        Data Visualization
                      </Typography>
                      <Button onClick={onClickLoadmapClose} color="inherit">
                        Close
                      </Button>
                    </Toolbar>
                  </AppBar>
                  <Loadmap
                    userSimulation={cellProps.row.original}
                    user={props.user}
                    isModal={false}
                    isFolder={true}
                    isTimeline={true}
                    isScreenrecord={true}
                  />
                </Box>
              </Modal>
              <ReallocateDialogue
                open={state.isSettingOpen}
                handleClose={onHandleSettingClose}
                onReopen={onClickSetting}
                title={`Are you sure you want to re-allocate settings on this ${userFollowup?.simulationType} simulation?
                (${userFollowup.simulation?.label} - ${userFollowup.user?.name})`}
                text={
                  "The settings on this simulation will be re-allocated permanently. You can't undo this action."
                }
                usageTime={usageTime}
                testTime={testTime}
                attemptCount={attemptCount}
                yesText={'Re-allocate'}
                noText={'Cancel'}
              />
            </Box>
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
