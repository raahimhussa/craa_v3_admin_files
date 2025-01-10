import { WrappingFunction } from '@shopify/react-compose'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
const withState =
  (getState = ({ }) => { }, propName = 'state'): WrappingFunction =>
    (WrappedComponent) =>
      observer((props) => {
        const state: any = getState(props)
        const _props = {
          [propName]: observable(state),
        }
        return <WrappedComponent {...props} {..._props} />
      })

export default withState
