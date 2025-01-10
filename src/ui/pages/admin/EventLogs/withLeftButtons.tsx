import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
const withLeftButtons = (WrappedComponent: any) =>
  observer(({ state, ...rest }: any) => {
    const { modalStore } = useRootStore()

    const leftButtons = [
      {
        title: 'CreateTrainings',
        onClick: () => (modalStore.training.isVisible = true),
      },
    ]

    return <WrappedComponent {...rest} leftButtons={[]} state={state} />
  })

export default withLeftButtons
