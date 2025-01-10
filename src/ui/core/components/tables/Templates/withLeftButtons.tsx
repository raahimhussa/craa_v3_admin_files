import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
import Template from 'src/ui/pages/admin/modals/Template/Template'
const withLeftButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { state } = props
    const { uiState: { modal }, templateStore } = useRootStore()

    const leftButtons = [
      {
        title: 'NEW',
        onClick: () => {
          templateStore.resetForm()
          modal.open('Template', <Template />)
        },
        color: 'primary',
      },
    ]

    return <WrappedComponent {...props} leftButtons={leftButtons} state={state} />
  })

export default withLeftButtons
