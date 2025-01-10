import { observer } from 'mobx-react'
import { Column } from 'react-table'
const withColumns = (WrappedComponent: any) =>
  observer(({ ...rest }) => {
    const columns: Array<Column> = [
      {
        Header: '_id',
        accessor: '_id',
      },
      {
        Header: 'Selection',
        accessor: 'idsss',
      },
      {
        Header: '_id1',
        accessor: 'id2',
      },
      {
        Header: '_id2',
        accessor: 'id3',
      },
      {
        Header: '_id3',
        accessor: 'id4',
      },
    ]

    const meta = {
      columns,
    }

    return <WrappedComponent {...rest} {...meta} />
  })

export default withColumns
