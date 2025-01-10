import compose from '@shopify/react-compose'
import VendorsView from './VendorsView'
import { withFind } from '@hocs'

const getFilter = () => ({
  isDeleted: false,
})

export default compose<any>(
  withFind({
    collectionName: 'vendors',
    getFilter,
    version: 2,
  }))(VendorsView)
