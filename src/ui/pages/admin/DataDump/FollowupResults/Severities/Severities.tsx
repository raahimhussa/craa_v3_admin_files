import SeveritiesView from './SeveritiesView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'

const getFilter = () => ({
  isDeleted: false,
})

export default compose<any>()(SeveritiesView)
