import Finding from 'src/ui/pages/admin/Finding/Finding'
import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import { useRootStore } from 'src/stores'
const withLeftButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { state, findingsMutate, simulationMappersMutate } = props
    const {
      findingStore,
      uiState: { modal },
    } = useRootStore()

    const leftButtons = []

    return <WrappedComponent {...props} state={state} />
  })

export default withLeftButtons
