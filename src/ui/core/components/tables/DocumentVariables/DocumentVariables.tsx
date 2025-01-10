import compose from '@shopify/react-compose'
import DocumentVariablesView from './DocumentVariablesView'
import { withState } from '@hocs'
import withColumns from './withColumns'
import withLeftButtons from './withLeftButtons'
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
)(DocumentVariablesView)
