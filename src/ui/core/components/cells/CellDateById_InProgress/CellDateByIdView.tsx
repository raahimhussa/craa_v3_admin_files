import { observer } from 'mobx-react'
import moment from 'moment'
import { CellProps } from 'react-table'
function CellTimestampView(props: CellProps<any>) {
  const row = props.row.original
  return <span>{moment(row.createdAt).format('YY/MM/DD HH:mm:ss')}</span>
}
export default observer(CellTimestampView)
