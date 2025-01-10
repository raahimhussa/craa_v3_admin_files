import SimManagementFilterView from './SimManagementFilterView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
import withREST from 'src/hocs/withREST'

export default compose<any>(
  withREST({
    collectionName: 'clientUnits',
    path: () => '',
    params: () => ({
      filter: {
        isDeleted: false,
        vendor: '',
      },
    }),
    uiStoreKey: 'clientUnits',
  }),
  withFind({
    collectionName: 'simulations',
    getFilter: () => ({
      isDeleted: false,
    }),
  })
)(SimManagementFilterView)
