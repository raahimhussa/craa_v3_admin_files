import compose from '@shopify/react-compose'
import LogsView from './LogsView'
import { withFind } from '@hocs'
// @ts-ignore
const getLogsFilter = (props) => ({
  userId: props.userId
})

export default compose<any>(
  withFind({
    collectionName: 'logs',
    getFilter: getLogsFilter,
    version: 2
  }),
)(LogsView)
