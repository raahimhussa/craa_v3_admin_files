import compose from '@shopify/react-compose'
import SimulationsView from './SimulationsView'
import { withState } from '@hocs'
import withColumns from './withColumns'
import withLeftButtons from './withLeftButtons'
import withRightButtons from './withRightButtons'
import withDataGridContext from './withDataGridContext'; 

const getState = () => () => ({
  selectedRowIds: [], 
})

export default compose<any>(
  withState(getState),
  // withState(getState(setSortBy)),
  withColumns,
  // withLeftButtons,
  // withRightButtons,
  withDataGridContext
)(SimulationsView)

