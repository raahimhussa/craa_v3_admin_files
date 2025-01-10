import { observer } from 'mobx-react'
const withMeta = (WrappedComponent: any) =>
  observer(({ ...rest }) => {
    return <WrappedComponent {...rest} />
  })

export default withMeta
