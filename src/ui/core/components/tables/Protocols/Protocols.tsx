import compose from '@shopify/react-compose'
import ProtocolsView from './ProtocolsView'
import { withState } from '@hocs'
import withColumns from './withColumns'
import withLeftButtons from './withLeftButtons'
import withRightButtons from './withRightButtons'

const getState = () => ({
  selectedRowIds: {},
  selectedRows: [],
})

export default compose<any>(
  withState(getState),
  withColumns,
  withLeftButtons,
  withRightButtons
)(ProtocolsView)
