import { withFind, withState } from '@hocs'
import compose from '@shopify/react-compose'
import AssessmentCycleView from './AssessmentCycleView'

const getFilter = () => ({
  isDeleted: false,
})

export default compose<any>(
  withFind({ collectionName: 'simulations', getFilter }),
  withFind({ collectionName: 'assessmentTypes', getFilter }),
  withFind({ collectionName: 'docs', getFilter }),
  withFind({ collectionName: 'tutorials', version: 2, getFilter })
)(AssessmentCycleView)
