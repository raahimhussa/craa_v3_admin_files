import { withFind, withState } from '@hocs'
import compose from '@shopify/react-compose'
import AssignTrainingView from './AssignTrainingView'
const getState = () => ({
  userId: '',
  assessmentCycleId: '',
})

export default compose<any>(
  withFind({
    collectionName: 'assessmentCycles',
  }),
  withFind({
    collectionName: 'users',
  }),
  withFind({
    collectionName: 'simulations',
  }),
  withState(getState)
)(AssignTrainingView)
