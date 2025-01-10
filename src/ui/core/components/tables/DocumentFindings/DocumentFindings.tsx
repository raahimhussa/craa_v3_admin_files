import DocumentFindingsView from './DocumentFindingsView'
import compose from '@shopify/react-compose'
import withColumns from './withColumns'
import withLeftButtons from './withLeftButtons'
import withRightButtons from './withRightButtons'
import { withState } from '@hocs'

const getState = () => ({
  selectedRowIds: [],
})

export default compose<any>(
  withState(getState),
  withColumns,
  withLeftButtons,
  withRightButtons
)(DocumentFindingsView)
