import { AdminColumn, CellType } from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
const withColumns = (WrappedComponent: any) =>
  observer(({ ...rest }) => {
    const columns: Array<AdminColumn> = [
      {
        Header: 'Label',
        accessor: 'label',
        cellType: CellType.Editable,
        version: 2,
        collectionName: 'policies',
        minWidth: 150,
      },
      {
        Header: 'Added Date',
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
