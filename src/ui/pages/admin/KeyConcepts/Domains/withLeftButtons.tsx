import KeyConcept from 'src/ui/pages/admin/KeyConcept/KeyConcept'
import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
const withLeftButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { state } = props
    const {
      uiState: { modal },
      keyConceptStore,
    } = useRootStore()

    const leftButtons = [
      {
        title: 'NEW',
        onClick: () => {
          keyConceptStore.resetForm()
          modal.open('KeyConcept', <KeyConcept />)
        },
        color: 'primary',
      },
    ]

    return (
      <WrappedComponent {...props} leftButtons={leftButtons} state={state} />
    )
  })

export default withLeftButtons
