import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
const withLeftButtons = (WrappedComponent: any) =>
  observer(({ state, ...rest }: any) => {
    const { modalStore } = useRootStore()

    const leftButtons = [
      {
        title: 'leftButtons',
        onClick: () => (modalStore.exam.isVisible = true),
      },
    ]

    return <WrappedComponent {...rest} leftButtons={leftButtons} state={state} />
  })

export default withLeftButtons
