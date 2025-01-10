import SimulationsView from './SimulationsView'
import UserSimulation from 'src/models/userSimulation'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
import withFindOne from 'src/hocs/withFindOne'

export default compose<any>(
  withFind({
    collectionName: 'simulations',
    getFilter: ({
      userSimulations,
    }: {
      userSimulations: UserSimulation[]
    }) => ({
      _id: {
        $in: userSimulations.map(
          (_userSimulation) => _userSimulation.simulationId
        ),
      },
    }),
  })
)(SimulationsView)
