import { withFind, withState } from '@hocs'

import FollowupsView from './FollowupsView'
import compose from '@shopify/react-compose'
import withColumns from './withColumns'

const getState = () => ({
  selectedRowIds: [],
})

export default compose<any>(withState(getState), withColumns)(FollowupsView)
// withFind({
//   collectionName: 'assessmentTypes',
//   getFilter,
//   uiStoreKey: 'assessmentTypes',
// })
