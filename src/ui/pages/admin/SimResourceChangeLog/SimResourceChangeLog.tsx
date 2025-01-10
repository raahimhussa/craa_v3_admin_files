import SimResourceChangeLogView from './SimResourceChangeLogView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'

const getFilter = () => ({
  // isDeleted: { $eq: false },
  screen: 'simResources'
})

export default compose<any>()(SimResourceChangeLogView)
