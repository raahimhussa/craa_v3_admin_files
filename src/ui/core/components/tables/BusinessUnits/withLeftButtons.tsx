import BusinessUnit from 'src/ui/pages/admin/BusinessUnit/BusinessUnit'
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

    // const { modal } = useRootStore()
    const leftButtons: any = [
      {
        title: 'ADD',
        onClick: () => {
          clientUnitStore.form = props.clientUnit
          clientUnitStore.resetBusinessUnitForm()
          clientUnitStore.addBusinessUnit()
          clientUnitStore.updateType = UpdateType.BusinessUnit
          clientUnitStore.mutate = props.clientUnitsMutate
          modal.open('BusinessUnit', <BusinessUnit />)
        },
        color: 'primary',
      },
    ]

    return (
      <WrappedComponent {...props} leftButtons={leftButtons} state={state} />
    )
  })

export default withLeftButtons
