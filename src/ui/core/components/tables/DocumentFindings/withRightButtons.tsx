import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
const withRightButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const rightButtons: any = []
    return <WrappedComponent {...props} rightButtons={rightButtons} />
  })

export default withRightButtons
