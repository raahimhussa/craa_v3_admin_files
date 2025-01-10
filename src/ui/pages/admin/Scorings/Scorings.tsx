import AuthStore from 'src/stores/authStore'
import ScoringView from './ScoringsView'
import _ from 'lodash'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
import withREST from 'src/hocs/withREST'

const getAssessmentFilter = ({ user }: { user: any }) => {
  return {
    filter: {
      $or: [
        { 'firstScorer._id': user?._id },
        { 'secondScorer._id': user?._id },
      ],
      isDeleted: false,
    },
  }
}

export default compose<any>(
  // withFind({
  //   collectionName: 'assessments',
  //   getFilter: getAssessmentFilter,
  //   version: 2,
  // }),
  withREST({
    collectionName: 'scoringManagement',
    version: 3,
    params: getAssessmentFilter,
    propName: 'assessments',
  })
)(ScoringView)
