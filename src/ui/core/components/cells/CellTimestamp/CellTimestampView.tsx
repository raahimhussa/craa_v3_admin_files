import { CellProps } from 'react-table'
import moment from 'moment'
import { observer } from 'mobx-react'
function CellTimestampView(props: CellProps<any>) {
  const row = props.row.original
  // @ts-ignore
  const id = props.column.id
  const date = row[id]

  return (
    <span
      style={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {moment(date).format('MM/DD/YY HH:mm:ss')}
    </span>
  )
}
export default observer(CellTimestampView)
