import Protocol from 'src/ui/pages/admin/modals/Protocol/Protocol'
import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
const withLeftButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { state } = props
    const {
      uiState: { modal },
      docStore,
    } = useRootStore()

    const leftButtons = [
      {
        title: 'NEW',
        onClick: () => {
          docStore.resetForm()
          props.onClickOpen && props.onClickOpen()
        },
        color: 'primary',
      },
    ]

    return (
      <WrappedComponent {...props} leftButtons={leftButtons} state={state} />
    )
  })

export default withLeftButtons
