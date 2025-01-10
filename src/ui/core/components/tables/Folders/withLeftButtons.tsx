import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
const withLeftButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { state } = props
    const { modalStore } = useRootStore()
    const leftButtons = [
      {
        title: 'New',
        onClick: () => {
          modalStore.folder.isVisible = true
          modalStore.folder.payload = {
            folder: {
              kind: 'DocFolder',
              parentId: '',
              depth: 0,
            },
          }
        },
        color: 'primary',
      },
    ]

    return <WrappedComponent {...props} leftButtons={leftButtons} state={state} />
  })

export default withLeftButtons
