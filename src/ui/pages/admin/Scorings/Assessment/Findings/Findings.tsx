import FindingsView from './FindingsView'
import { IAssessment } from 'src/models/assessment/assessment.interface'
import IFolder from 'src/models/folder/folder.interface'
import { ISimDoc } from 'src/models/simDoc/types'
import ISimulation from 'src/models/simulation/simulation.interface'
import UserSimulation from 'src/models/userSimulation'
import _ from 'lodash'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
import withFindOne from 'src/hocs/withFindOne'
import withREST from 'src/hocs/withREST'

const getAssessmentsFilter = ({
  userSimulation,
}: {
  userSimulation: UserSimulation
}) => ({
  userSimulationId: userSimulation._id,
  isDeleted: false,
})

const getNotesFilter = ({
  userSimulation,
}: {
  userSimulation: UserSimulation
}) => ({
  'viewport.userSimulationId': userSimulation._id,
  isDeleted: false,
})

export default compose<any>(
  withREST({
    collectionName: 'findings',
    path: ({ userSimulation }: { userSimulation: UserSimulation }) => {
      return `simulations/${userSimulation.simulationId}/simDocs`
    },
    version: 2,
    propName: 'findingsBySimDoc',
  }),
  withFindOne({
    collectionName: 'assessments',
    version: 2,
    getFilter: getAssessmentsFilter,
  }),
  withFind({
    collectionName: 'notes',
    version: 2,
    getFilter: getNotesFilter,
  }),
  withFind({
    collectionName: 'users',
    getFilter: ({
      firstScorerId,
      secondScorerId,
    }: {
      firstScorerId: string
      secondScorerId: string
    }) => {
      return {
        _id: {
          $in: [firstScorerId, secondScorerId],
        },
      }
    },
    propName: 'scorers',
  })
)(FindingsView)
