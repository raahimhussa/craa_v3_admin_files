import TrainingsView from './TrainingsView'
import UserSimulation from 'src/models/userSimulation'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'

export default compose<any>(
  withFind({
    collectionName: 'simulations',
    getFilter: ({ userFollowups }: { userFollowups: UserSimulation[] }) => ({
      _id: {
        $in: userFollowups.map((userFollowups) => userFollowups.simulationId),
      },
    }),
  }),
  withFind({
    collectionName: 'trainings',
    version: 2,
    getFilter: () => ({}),
  })
)(TrainingsView)
