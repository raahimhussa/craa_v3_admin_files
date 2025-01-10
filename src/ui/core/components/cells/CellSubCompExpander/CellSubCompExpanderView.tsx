import { ExpandLess, ExpandMore } from '@mui/icons-material'

import { CellProps } from 'react-table'
import { observer } from 'mobx-react'

function CellSubCompExpanderView(props: CellProps<any>) {
  const row = props.row

  const defaultHideIcon = <ExpandLess htmlColor="#666666" />
  const defaultShowIcon = <ExpandMore htmlColor="#666666" />

  const _style: React.CSSProperties = {
    // paddingLeft: `${row.original?.depth * 2}rem`,
    display: 'inline-flex',
    verticalAlign: 'middle',
  }

  return (
    <span
      {...row.getToggleRowExpandedProps({
        style: _style,
      })}
    >
      {row.isExpanded ? defaultHideIcon : defaultShowIcon}
    </span>
  )
}
export default observer(CellSubCompExpanderView)
