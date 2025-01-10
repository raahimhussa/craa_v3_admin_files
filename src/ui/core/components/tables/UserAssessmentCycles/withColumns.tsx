import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'

import { CellProps } from 'react-table'
import { IconButton } from '@mui/material'
import Logs from 'src/ui/pages/admin/SimManagement/LogsPage/Logs'
import ScreenRecorders from '../ScreenRecords/ScreenRecords'
import { Videocam } from '@mui/icons-material'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'

const withColumns = (WrappedComponent: any) =>
  observer(({ ...rest }) => {
    const columns: AdminColumn[] = [
      {
        Header: 'Label',
        accessor: 'assessmentCycle.name',
        type: Type.String,
      },
      {
        Header: 'Baseline Logs',
        cellType: CellType.SubComponent,
        renderRowSubComponent: (cellProps: CellProps<any>) => (
          <Logs userId={cellProps.row.original.userId} />
        ),
      },
      // {
      //   Header: 'Followup Logs',
      //   cellType: CellType.SubComponent,
      //   renderRowSubComponent: (cellProps: CellProps<any>) => <Logs userId={cellProps.row.original.userId} />
      // },
      {
        Header: 'Start Date',
        accessor: 'assessmentCycle.startDate',
        cellType: CellType.Date,
      },
      {
        Header: 'UserId',
        accessor: 'userId',
      },
      {
        Header: 'End Date',
        accessor: 'assessmentCycle.endDate',
        cellType: CellType.Date,
      },
      {
        Header: 'Added Date',
        accessor: 'assessmentCycle.createdAt',
        cellType: CellType.Date,
      },
      {
        Header: 'ScreenRecorder',
        Cell: (cellProps: any) => {
          const { dialogStore } = useRootStore()
          const onClick = () => {
            dialogStore.dialog.isVisible = true
            dialogStore.dialog.title = 'ScreenRecorder'
            dialogStore.dialog.content = (
              <ScreenRecorders
                userSimulationId={cellProps.row.original.userSimulationId}
              />
            )
          }
          return (
            <IconButton onClick={onClick}>
              <Videocam />
            </IconButton>
          )
        },
        minWidth: 300,
      },
    ]

    const meta = {
      columns,
    }
    return <WrappedComponent {...rest} {...meta} />
  })

export default withColumns
