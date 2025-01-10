import SimulationView from './SimulationView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
export default compose<any>(
  withFind({
    collectionName: 'simulationMappers',
    version: 3,
    getFilter: (props: any) => {
      return { isDeleted: false }
    },
  })
)(SimulationView)
