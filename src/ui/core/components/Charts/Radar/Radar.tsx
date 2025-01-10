import RadarView from './RadarView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
export default compose<any>(
  withFind({
    collectionName: 'domains',
    version: 2,
    getFilter: () => ({
      isDeleted: false,
      depth: 0,
      followupNumber: { $gt: 0 },
    }),
  })
)(RadarView)
