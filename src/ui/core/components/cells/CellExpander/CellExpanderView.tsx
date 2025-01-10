import { observer } from 'mobx-react'
import { CellProps } from 'react-table'
function CellExpanderView(props: CellProps<any>) {
  const row = props.row
  return row.canExpand ? (
    <span
      {...row.getToggleRowExpandedProps({
        style: {
          paddingLeft: `${row.depth * 2}rem`,
        },
      })}
    >
      {row.isExpanded ? 'Show' : 'Hide'}
    </span>
  ) : null
}
export default observer(CellExpanderView)
