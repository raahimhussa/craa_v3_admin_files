import { withFind } from '@hocs'
import compose from '@shopify/react-compose'
import CategoriesView from './CategoriesView'
const getFilter = () => ({
  isDeleted: false,
})

export default compose<any>(
  withFind({
    collectionName: 'categories',
    getFilter,
  })
)(CategoriesView)
