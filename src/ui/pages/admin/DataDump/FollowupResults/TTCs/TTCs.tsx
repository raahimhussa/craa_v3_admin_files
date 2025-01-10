import TTCsView from './TTCsView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'

const getFilter = () => ({
  isDeleted: false,
})

export default compose<any>()(TTCsView)
