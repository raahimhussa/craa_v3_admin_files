import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
import ScorerSetting from 'src/ui/pages/admin/settings/Scorer/Scorer'
const withLeftButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { state } = props
    const { uiState: { modal } } = useRootStore()
    const leftButtons: any = [{
      title: 'Setting',
      onClick: () => {
        modal.open('Scorer Setting', <ScorerSetting />)
      }
    }]

    return <WrappedComponent {...props} leftButtons={leftButtons} state={state} />
  })

export default withLeftButtons
