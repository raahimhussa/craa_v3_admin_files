import CellButtons from 'src/ui/core/components/cells/CellButtons/CellButtons'
import { AdminColumn, CellType, Type } from 'src/ui/core/components/DataGrid/DataGrid'
import Button from '@mui/material/Button'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
const withColumns = (WrappedComponent: any) =>
  observer(({ ...rest }) => {
    const { uiState: { modal } } = useRootStore()
    const columns: Array<AdminColumn> = [
      {
        Header: 'Name',
        accessor: 'name',
        collectionName: 'domains',
        cellType: CellType.Editable,
        type: Type.String,
        minWidth: 300,
      },
      {
        Header: 'parentId',
        accessor: 'parentId',
        minWidth: 150,
      },
      {
        Header: 'added Date',
        accessor: 'createdAt',
        cellType: CellType.Date,
        minWidth: 150,
      },
    ]

    const meta = {
      columns,
    }

    return <WrappedComponent {...rest} {...meta} />
  })

export default withColumns
