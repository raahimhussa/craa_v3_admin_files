import Client from 'src/ui/pages/admin/Client/Client'
import { UpdateType } from 'src/stores/clientUnitStore'
import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
const withLeftButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { state } = props
    const {
      clientUnitStore,
      uiState: { modal },
    } = useRootStore()

    const leftButtons = [
      {
        title: 'New',
        onClick: () => {
          // clientStore.resetForm()
          clientUnitStore.resetForm()
          clientUnitStore.resetBusinessUnitForm()
          clientUnitStore.resetBusinessCycleForm()
          clientUnitStore.updateType = UpdateType.ClientUnit
          modal.open('Client', <Client />)
        },
        color: 'primary',
      },
    ]

    return (
      <WrappedComponent {...props} leftButtons={leftButtons} state={state} />
    )
  })

export default withLeftButtons
