import compose from '@shopify/react-compose'
import TemplatesView from './TemplatesView'
import { withFind } from '@hocs'

const getFilter = () => ({
  isDeleted: false,
})

export default compose<any>(
  withFind({
    collectionName: 'templates',
    getFilter,
    uiStoreKey: 'templates'
  }))(TemplatesView)
