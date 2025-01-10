import ScorerSetting from 'src/ui/pages/admin/settings/Scorer/Scorer'
import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
const withLeftButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const leftButtons: any = []

    return <WrappedComponent {...props} leftButtons={leftButtons} />
  })

export default withLeftButtons
