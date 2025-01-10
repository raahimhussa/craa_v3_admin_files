import AssessmentView from './AssessmentView'
import _ from 'lodash'
import compose from '@shopify/react-compose'
import withFindOne from 'src/hocs/withFindOne'
import withParams from 'src/hocs/withParams'

const getUserSimulationFilter = ({
  userSimulationId,
}: {
  userSimulationId: string
}) => {
  return {
    _id: userSimulationId,
    isDeleted: false,
  }
}

const getAssessmentFilter = ({
  userSimulationId,
}: {
  userSimulationId: string
}) => {
  return {
    userSimulationId,
    isDeleted: false,
  }
}

export default compose<any>(
  withParams,
  withFindOne({
    collectionName: 'userSimulations',
    version: 2,
    getFilter: getUserSimulationFilter,
  }),
  withFindOne({
    collectionName: 'assessments',
    version: 2,
    getFilter: getAssessmentFilter,
  })
)(AssessmentView)
