import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
import { RootStore } from 'src/stores/root'
const withStore = (storeKey: keyof RootStore): WrappingFunction => (WrappedComponent) => observer((props) => {
  const store = useRootStore()

  const _props = {
    ...props,
    [storeKey as string]: store[storeKey]
  }

  return <WrappedComponent {..._props} />
})

export default withStore
