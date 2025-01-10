import compose from '@shopify/react-compose'
import PoliciesView from './PoliciesView'
import { withFind } from '@hocs'

const getFilter = () => ({
  isDeleted: false,
})

export default compose<any>(
  withFind({
    collectionName: 'policies',
    getFilter,
    version: 2
  }))(PoliciesView)
