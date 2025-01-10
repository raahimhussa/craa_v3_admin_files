import DashboardView from './DashboardView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
import withREST from 'src/hocs/withREST'

const getFilter = () => ({
  isDeleted: false,
})

export default compose<any>(
  withFind({
    collectionName: 'clientUnits',
    getFilter: () => ({
      isDeleted: false,
    }),
    getOptions: () => ({
      sort: {
        name: 1,
      },
    }),
  })
)(DashboardView)
// withREST({
//   collectionName: 'clientUnits',
//   path: () => '',
//   uiStoreKey: 'clientUnits',
// }),
