import { Button } from 'src/ui/core/components'
import { observer } from 'mobx-react'
import { CellProps } from 'react-table'
import { useRootStore } from 'src/stores'
function CellButtonsView(cellProps: CellProps<any> & { title?: string, itemId: string }) {
  const { modalStore } = useRootStore()
  const { column, value } = cellProps

  // @ts-ignore
  const modalKey = column.modalKey

  const onClickCell = () => {
    // @ts-ignore
    modalStore[modalKey].isVisible = true
    // @ts-ignore
    modalStore[modalKey].payload.rowId = value
  }

  return (
    <Button
      onClick={onClickCell}
      variant='outlined'>
      {column.Header}
    </Button>
  )
}
export default observer(CellButtonsView)
