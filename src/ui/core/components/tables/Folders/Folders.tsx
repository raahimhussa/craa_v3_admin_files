import compose from '@shopify/react-compose'
import FoldersView from './FoldersView'
import { withState } from '@hocs'
import withColumns from './withColumns'
import withLeftButtons from './withLeftButtons'
import withRightButtons from './withRightButtons'

// @ts-ignore
const getState = (props) => ({
  selectedRowIds: [],
})

export default compose<any>(
  withState(getState),
  withColumns,
  withLeftButtons,
  withRightButtons
)(FoldersView)
