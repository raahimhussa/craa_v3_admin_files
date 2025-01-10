import compose from '@shopify/react-compose'
import TrainingsView from './EventLogsView'
import { withFind, withState } from '@hocs'
import withColumns from './withColumns'
import withLeftButtons from './withLeftButtons'
import withRightButtons from './withRightButtons'

const getState = () => ({
  selectedRowIds: [],
})

export default compose<any>(
  // withFind({
  //   collectionName: 'eventLogs',
  // }),
  withState(getState),
  withColumns,
  withLeftButtons,
  withRightButtons
)(TrainingsView)
