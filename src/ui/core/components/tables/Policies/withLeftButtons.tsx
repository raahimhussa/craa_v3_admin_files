import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
const withLeftButtons: WrappingFunction = (WrappedComponent) =>
  observer((props) => {
    const { state } = props
    const { modalStore } = useRootStore()

    const leftButtons = [
      {
        title: 'NEW',
        onClick: () => {
          modalStore.policy.isVisible = true
        },
        color: 'primary',
      },
    ]

    return <WrappedComponent {...props} leftButtons={leftButtons} state={state} />
  })

export default withLeftButtons