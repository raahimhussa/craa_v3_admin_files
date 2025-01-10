import StudyDocument from 'src/ui/pages/admin/modals/StudyDocument/StudyDocument'
import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
const withLeftButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { state } = props
    const {
      uiState: { modal },
      docStore,
    } = useRootStore()

    const leftButtons = [
      {
        title: 'New',
        onClick: () => {
          docStore.resetForm()
          props.onClickOpen && props.onClickOpen()
        },
        color: 'primary',
      },
    ]

    return <WrappedComponent leftButtons={leftButtons} {...props} state={state} />
  })

export default withLeftButtons
