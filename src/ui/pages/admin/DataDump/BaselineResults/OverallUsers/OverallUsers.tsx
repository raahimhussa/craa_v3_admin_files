import OverallUsersView from './OverallUsersView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
import withREST from 'src/hocs/withREST'

const getFilter = () => ({
  isDeleted: false,
})

export default compose<any>(
  withFind({
    collectionName: 'domains',
    getFilter: () => ({
      depth: 0,
      followupNumber: { $gt: 0 },
    }),
    version: 2,
  })
)(OverallUsersView)
