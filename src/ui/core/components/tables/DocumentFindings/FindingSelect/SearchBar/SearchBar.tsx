import SearchBarView from './SearchBarView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
import withREST from 'src/hocs/withREST'

export default compose<any>(
  withFind({
    collectionName: 'simulations',
    getFilter: () => ({}),
  })
)(SearchBarView)
