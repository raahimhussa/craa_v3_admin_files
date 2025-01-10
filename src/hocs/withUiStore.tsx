import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
import UiState from 'src/stores/ui'
const withUiStore = (storeKey: keyof UiState): WrappingFunction => (WrappedComponent) => observer((props) => {
  const { uiState } = useRootStore()

  const _props = {
    ...props,
    [storeKey as string]: uiState[storeKey]
  }

  return <WrappedComponent {..._props} />
})

export default withUiStore
