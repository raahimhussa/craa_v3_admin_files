import AssessmentTopBarView from './AssessmentTopBarView'
import UserSimulation from 'src/models/userSimulation'
import _ from 'lodash'
import compose from '@shopify/react-compose'
import withFindOne from 'src/hocs/withFindOne'
import { withFind } from '@hocs'

const getAssessmentsFilter = ({
  userSimulation,
}: {
  userSimulation: UserSimulation
}) => {
  return {
    userSimulationId: userSimulation._id,
    isDeleted: false,
  }
}

export default compose<any>(
  withFindOne({
    collectionName: 'assessments',
    version: 2,
    getFilter: getAssessmentsFilter,
  }),
  withFindOne({
    collectionName: 'users',
    version: 1,
    getFilter: (props: any) => {
      return {
        _id: props.userSimulation.userId,
      }
    },
  }),
  withFind({
    collectionName: 'userSimulations',
    version: 2,
    getFilter: (props: any) => {
      return {
        _id: props.userSimulation._id,
      }
    },
  })
)(AssessmentTopBarView)
