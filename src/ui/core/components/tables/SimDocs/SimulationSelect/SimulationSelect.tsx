import SimulationSelectView from './SimulationSelectView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'

export default compose<any>(
  withFind({
    collectionName: 'simulations',
    getFilter: () => ({
      isDeleted: false,
    }),
  })
)(SimulationSelectView)
