import { EditorProps } from '@toast-ui/react-editor'
import SelectSimulationsView from './SelectSimulationsView'
import UserAssessmentCycle from 'src/models/userAssessmentCycle'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
import withREST from 'src/hocs/withREST'

export default compose<any>(
  withFind({
    collectionName: 'userSimulations',
    version: 2,
    getFilter: (props: { userAssessmentCycles: UserAssessmentCycle[] }) => {
      const { userAssessmentCycles } = props
      const userSimulationIds = [] as string[]
      userAssessmentCycles.forEach((_userAssessmentCycle) => {
        _userAssessmentCycle.userBaselineId &&
          userSimulationIds.push(_userAssessmentCycle.userBaselineId)
        _userAssessmentCycle.userFollowupIds.forEach((_userFollowupId) =>
          userSimulationIds.push(_userFollowupId)
        )
      })
      return {
        _id: { $in: userSimulationIds },
        isDeleted: false,
      }
    },
  }),
  withREST({
    collectionName: 'userTrainings',
    path: () => 'originalFind',
    version: 2,
    params: (props: { userAssessmentCycles: UserAssessmentCycle[] }) => {
      const { userAssessmentCycles } = props
      const userTrainingIds = [] as string[]
      userAssessmentCycles.forEach((_userAssessmentCycle) => {
        _userAssessmentCycle.userTrainingIds.forEach((_userTrainingId) =>
          userTrainingIds.push(_userTrainingId)
        )
      })
      return {
        filter: {
          _id: { $in: userTrainingIds },
          isDeleted: false,
        },
      }
    },
  })
)(SelectSimulationsView)
