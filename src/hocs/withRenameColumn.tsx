import { WrappingFunction } from '@shopify/react-compose'
import _ from 'lodash'
import { observer } from 'mobx-react'

const withRenameColumn = (rename: string): WrappingFunction => (WrappedComponent) =>
  observer((props) => {
    const { columns } = props
    if (!columns) {
      console.error('columns not provided')
    }

    const _props = {
      [rename]: columns
    }

    return <WrappedComponent {...props} {..._props} />
  })

export default withRenameColumn
