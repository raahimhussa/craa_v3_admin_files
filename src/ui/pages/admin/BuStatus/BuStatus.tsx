import BuStatusView from './BuStatusView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'

const getFilter = () => ({
  isDeleted: false,
})

export default compose(
  withFind({
    collectionName: 'users',
    uiStoreKey: 'users',
  }),
  withFind({
    collectionName: 'clientUnits',
    getFilter,
  }),
  withFind({
    collectionName: 'assessmentCycles',
    getFilter,
  }),
  withFind({
    collectionName: 'domains',
    version: 2,
    getFilter: () => ({
      isDeleted: false,
      depth: 0,
      followupNumber: { $gt: 0 },
    }),
  })
)(BuStatusView)
