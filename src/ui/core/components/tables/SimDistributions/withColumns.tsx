import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'
import {
  AppBar,
  Box,
  Button,
  Checkbox,
  Modal,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import {
  AssessmentStatus,
  SimulationType,
  UserSimulationStatus,
} from 'src/utils/status'
import { observer, useLocalObservable } from 'mobx-react'

import Assessment from 'src/models/assessment'
import { CellProps } from 'react-table'
import ClientName from './columns/ClientName'
import ClientUnit from 'src/models/clientUnit'
import DistributeAllDialog from './columns/DistributeAllDialog'
import DistributeDialog from './columns/DistributeDialog'
// import { EnhancedAssessment } from 'src/ui/pages/admin/Reporting/ReportingView'
import Reporting from 'src/ui/pages/admin/Reporting/Reporting'
import User from 'src/models/user'
import UserAssessmentCycle from 'src/models/userAssessmentCycle'
import UserFirstName from './columns/UserFirstName'
import UserLastName from './columns/UserLastName'
import UserName from './columns/UserName'
import UserSimulation from 'src/models/userSimulation'
import UserTrainingRepository from 'src/repos/v2/userTrainingRepository'
import { WrappingFunction } from '@shopify/react-compose'
import axios from 'axios'
import { highlightedText } from 'src/utils/highlightedText'
import moment from 'moment'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'

const withColumns: WrappingFunction = (WrappedComponent) =>
  observer((props) => {
    const { enqueueSnackbar } = useSnackbar()
    const {
      uiState: { modal },
      assessmentStore,
      userSimulationStore,
    } = useRootStore()

    const mutate = async () => {
      await props.countMutate()
      await props.simDistributionMutate()
    }

    const columns: Array<AdminColumn> = [
      {
        Header: 'Client',
        accessor: 'clientUnit.name',
        minWidth: 150,
        type: Type.String,
        Cell: (cellProps: CellProps<any>) => {
          return highlightedText(cellProps.value, props.searchString)
        },
      },
      {
        Header: 'Initial',
        accessor: 'user.profile.initial',
        minWidth: 150,
        type: Type.String,
        Cell: (cellProps: CellProps<any>) => {
          return highlightedText(cellProps.value, props.searchString)
        },
      },
      {
        Header: 'Last Name',
        accessor: 'user.profile.lastName',
        minWidth: 150,
        type: Type.String,
        Cell: (cellProps: CellProps<any>) => {
          return highlightedText(cellProps.value, props.searchString)
        },
      },
      {
        Header: 'First Name',
        accessor: 'user.profile.firstName',
        minWidth: 150,
        type: Type.String,
        Cell: (cellProps: CellProps<any>) => {
          return highlightedText(cellProps.value, props.searchString)
        },
      },
      {
        Header: 'Time Spent',
        cellType: CellType.Date,
        Cell: (cellProps: CellProps<any>) => {
          const {
            row: { original },
          } = cellProps
          const userBaseline = original.userBaseline as UserSimulation
          const userFollowups = original.userFollowups as UserSimulation[]
          let usageTime = userBaseline.usageTime || 0
          userFollowups.forEach((_userFollowup) => {
            usageTime += _userFollowup.usageTime || 0
          })

          return <Box>{usageTime}</Box>
        },
        minWidth: 150,
      },
      {
        Header: 'Due Date',
        cellType: CellType.Date,
        minWidth: 150,
        Cell: (cellProps: CellProps<any>) => {
          const {
            row: { original },
          } = cellProps
          const userBaseline = original.userBaseline as UserSimulation
          const userFollowups = original.userFollowups as UserSimulation[]

          const startDate = new Date(userBaseline.assignedAt) as Date
          let dueDate = new Date(
            new Date().setDate(startDate.getDate() + userBaseline.deadline)
          )

          userFollowups.forEach((_userFollowup) => {
            if (_userFollowup.status === UserSimulationStatus.HasNotAssigned) {
              return
            }

            const startDate = new Date(_userFollowup.assignedAt) as Date
            const _dueDate = new Date(
              new Date().setDate(startDate.getDate() + _userFollowup.deadline)
            )
            if (dueDate < _dueDate) dueDate = _dueDate
          })

          return <Box>{moment(dueDate).format('DD-MMM-YYYY')}</Box>
        },
      },
      {
        Header: 'Pending Client Review',
        minWidth: 150,
        Cell: () => <Checkbox></Checkbox>,
      },
      {
        Header: 'Unusual Behavior',
        minWidth: 150,
        Cell: () => <Checkbox></Checkbox>,
      },
      {
        Header: 'Minimum Effort',
        minWidth: 150,
        Cell: () => <Checkbox></Checkbox>,
      },
      {
        Header: ' ',
        minWidth: 150,
        Cell: observer((cellProps: CellProps<UserAssessmentCycle>) => {
          const {
            row: { original: userAssessmentCycle },
          } = cellProps
          const state = useLocalObservable(() => ({
            isOpen: false,
          }))

          const onClickReporting = () => {
            state.isOpen = true
          }

          const onClickClose = () => {
            state.isOpen = false
          }

          return (
            <>
              <Stack direction={'row'} spacing={1}>
                {/* <Button variant="outlined" onClick={onClickReporting}>
                  UserCard
                </Button> */}
                {((userAssessmentCycle as any).userBaseline as UserSimulation)
                  .status === UserSimulationStatus.Published && (
                  <DistributeDialog
                    userSimulation={
                      (userAssessmentCycle as any)
                        .userBaseline as UserSimulation
                    }
                    user={(userAssessmentCycle as any).user as User}
                    disabled={false}
                    mutate={mutate}
                  />
                )}
                {((userAssessmentCycle as any).userBaseline as UserSimulation)
                  .status === UserSimulationStatus.Distributed ? (
                  <DistributeAllDialog
                    userAssessmentCycle={userAssessmentCycle}
                    user={(userAssessmentCycle as any).user as User}
                    disabled={false}
                    mutate={mutate}
                  />
                ) : null}
              </Stack>
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
                  <Reporting userId={cellProps.row.original.userId} />
                </Box>
              </Modal>
            </>
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
