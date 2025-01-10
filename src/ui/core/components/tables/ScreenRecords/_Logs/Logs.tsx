import LogsView from './LogsView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
import withStore from 'src/hocs/withStore'
const index = 0
const getFilter = (props: any) => {
  // if (props.type == 'baseline') {
  //   return {
  //     'viewports.0.userSimulationId': props.userSimulationId,
  //     screen: props.type,
  //     isDeleted: false,
  //   }
  // } else {
  //   return {
  //     screen: props.type,
  //     isDeleted: false,
  //   }
  // }
  return {
    'viewports.0.userSimulationId': props.userSimulationId,
    screen: 'baseline',
    isDeleted: false,
    event: {
      $ne: 'logout',
    },
  }
}
export default compose<any>(
  withFind({
    collectionName: 'logs',
    getFilter: getFilter,
    version: 2,
  })
)(LogsView)
