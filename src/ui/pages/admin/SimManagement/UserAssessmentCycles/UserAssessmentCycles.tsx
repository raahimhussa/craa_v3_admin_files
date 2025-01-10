import compose from '@shopify/react-compose'
import UserAssessmentCyclesView from './UserAssessmentCyclesView'
import { withFind } from '@hocs'

// @ts-ignore
const getUserAssessmentCyclesFilter = (props) => {
  return ({
    userId: props.userId
  })
}

const getAssessmentCyclesFilter = (props: any) => {
  return ({
    _id: {
      $in: props.userAssessmentCycles.map((uac: any) => uac.assessmentCycleId)
    }
  })
}

export default compose<any>(
  withFind({
    collectionName: 'userAssessmentCycles',
    getFilter: getUserAssessmentCyclesFilter,
  }),
  withFind({
    collectionName: 'assessmentCycles',
    getFilter: getAssessmentCyclesFilter,
  }),
)(UserAssessmentCyclesView)
