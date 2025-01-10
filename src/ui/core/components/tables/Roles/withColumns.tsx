import { AdminColumn, CellType, Type } from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
const withColumns = (WrappedComponent: any) =>
  observer(({ ...rest }) => {
    const columns: Array<AdminColumn> = [
      {
        Header: 'NAME',
        accessor: 'title',
        // cellType: CellType.Editable,
        type: Type.Number,
        minWidth: 300,
      },
      {
        Header: 'KEY',
        accessor: 'priority',
        // cellType: CellType.Editable,
        type: Type.Number,
        minWidth: 150,
      },
    ]

    const meta = {
      columns,
    }

    return <WrappedComponent {...rest} {...meta} />
  })

export default withColumns
