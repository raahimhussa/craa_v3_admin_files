import { observer } from 'mobx-react'
import { HeaderProps } from 'react-table'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
function CellHeaderExpanderView(props: HeaderProps<any> & any) {
  const defaultHideIcon = <ExpandLess htmlColor="#ffffff" />
  const defaultShowIcon = <ExpandMore htmlColor="#ffffff" />
  const { getToggleAllRowsExpandedProps, isAllRowsExpanded } = props

  const _style: React.CSSProperties = {
    display: 'inline-flex',
    verticalAlign: 'middle',
  }

  return (
    <span
      {...getToggleAllRowsExpandedProps({
        style: _style,
      })}
    >
      {isAllRowsExpanded ? defaultShowIcon : defaultHideIcon}
    </span>
  )
}
export default observer(CellHeaderExpanderView)
