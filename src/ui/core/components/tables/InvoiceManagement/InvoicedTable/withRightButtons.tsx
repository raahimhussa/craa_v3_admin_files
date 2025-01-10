import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
const withRightButtons: WrappingFunction = (WrappedComponent) =>
  observer((props) => {
    return <WrappedComponent {...props} />
  })

export default withRightButtons
