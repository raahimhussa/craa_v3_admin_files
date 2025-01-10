import Risk from 'src/ui/pages/admin/modals/Risk/Risk'
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
        title: 'New',
        onClick: () => {
          docStore.resetForm()
          modal.open('Risk Management', <Risk />)
        },
        color: 'primary',
      },
    ]

    return (
      <WrappedComponent {...props} leftButtons={leftButtons} state={state} />
    )
  })

export default withLeftButtons
