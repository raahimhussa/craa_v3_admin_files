import ClientsView from './ClientsView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'

export default compose<any>(
  withFind({
    collectionName: 'countries',
  })
)(ClientsView)
