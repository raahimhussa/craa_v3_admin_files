import AdjudicationsView from './AdjudicationsView'
import IUser from 'src/models/user/user.interface'
import compose from '@shopify/react-compose'

export default compose<any>()(AdjudicationsView)
// withFind({
//   collectionName: 'assessments',
//   getFilter: getAssessmentsFilter,
//   version: 2,
// })
