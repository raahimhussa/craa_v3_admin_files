import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
import Agreement from 'src/ui/pages/admin/modals/Agreement/Agreement'
const withLeftButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { state } = props
    const { uiState: { modal }, agreementStore } = useRootStore()

    const leftButtons = [
      {
        title: 'NEW',
        onClick: () => {
          agreementStore.resetForm()
          modal.open('Agreement', <Agreement />)
        },
        color: 'primary',
      },
    ]

    return <WrappedComponent {...props} leftButtons={leftButtons} state={state} />
  })

export default withLeftButtons
