import SimDistributionsView from './SimDistributionsView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'

const getFilter = () => ({
  isDeleted: false,
  // status: {
  //   $eq: AssessmentStatus.Published
  // }
})

export default compose<any>()(SimDistributionsView)
