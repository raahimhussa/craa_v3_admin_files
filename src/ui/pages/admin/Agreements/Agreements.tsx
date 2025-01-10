import compose from '@shopify/react-compose'
import AgreementsView from './AgreementsView'
import { withFind } from '@hocs'

const getFilter = () => ({
  isDeleted: false,
})

export default compose<any>(
  withFind({
    collectionName: 'agreements',
    getFilter,
    uiStoreKey: 'agreements'
  }))(AgreementsView)
