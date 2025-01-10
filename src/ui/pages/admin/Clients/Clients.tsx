import ClientsView from './ClientsView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
import withREST from 'src/hocs/withREST'

const getFilter = () => ({
  isDeleted: false,
})

export default compose<any>()(ClientsView)
// withREST({
//   collectionName: 'clientUnits',
//   path: () => '',
//   uiStoreKey: 'clientUnits',
// }),
// withFind({
//   collectionName: 'countries',
// })
