import { WrappingFunction } from '@shopify/react-compose'
import _ from 'lodash'
import { observer } from 'mobx-react'

const withProps: WrappingFunction = (WrappedComponent) =>
  observer((props) => {
    const { answers, findings } = props

    return <WrappedComponent {...props} />
  })

export default withProps
