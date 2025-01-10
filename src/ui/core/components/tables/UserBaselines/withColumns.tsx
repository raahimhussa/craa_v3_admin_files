import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'
import { Box, Button, modalClasses } from '@mui/material'

import { CellProps } from 'react-table'
import LightboxModal from 'src/ui/components/LightboxModal'
import Reporting from 'src/ui/pages/admin/Reporting/Reporting'
import UserAssessmentCycles from 'src/ui/pages/admin/SimManagement/UserAssessmentCycles/UserAssessmentCycles'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'

const withColumns = (WrappedComponent: any) =>
  observer(({ ...rest }) => {
    const columns: AdminColumn[] = [
      {
        Header: 'Simulation',
        accessor: 'simulation.label',
        type: Type.String,
      },
      {
        Header: 'username',
        accessor: 'user.name',
        type: Type.String,
      },
      {
        Header: 'email',
        accessor: 'user.email',
        type: Type.String,
      },
      {
        Header: 'A Cylcle',
        cellType: CellType.SubComponent,
        renderRowSubComponent: (cellProps: CellProps<any>) => {
          return <UserAssessmentCycles userId={cellProps.row.original.userId} />
        },
      },
      {
        Header: 'Reporting',
        Cell: () => {
          const {
            uiState: { modal },
          } = useRootStore()
          const onClickReporting = () => {
            // modal.open('Reporing', <Reporting />)
          }
          return (
            <Button variant="outlined" onClick={onClickReporting}>
              UserCard
            </Button>
          )
        },
      },
      {
        Header: 'Added At',
        accessor: 'addedAt',
        cellType: CellType.Date,
      },
    ]

    const meta = {
      columns,
    }
    return <WrappedComponent {...rest} {...meta} />
  })

export default withColumns
