import { withFind, withState } from '@hocs'

import FindingsView from './FindingsView'
import compose from '@shopify/react-compose'
import withColumns from './withColumns'
import withLeftButtons from './withLeftButtons'
import withREST from 'src/hocs/withREST'
import withRightButtons from './withRightButtons'

const getState = (props: any) =>
  props.state || {
    selectedRowIds: [],
  }

export default compose<any>(
  withState(getState),
  withColumns,
  withLeftButtons,
  withRightButtons
)(FindingsView)
