import AssessmentTypesView from './AssessmentTypesView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'

const getFilter = () => ({
  isDeleted: { $eq: false },
})

export default compose<any>()(AssessmentTypesView)
// withFind({
//   collectionName: 'assessmentTypes',
//   getFilter,
//   uiStoreKey: 'assessmentTypes',
// })
