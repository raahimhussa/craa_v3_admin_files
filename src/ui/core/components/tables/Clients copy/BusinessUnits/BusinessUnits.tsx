import BusinessUnitsView from './BusinessUnitsView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'

const getFilter = (props: any) => {
  const { client } = props
  return {
    clientId: client._id,
    isDeleted: false,
  }
}

export default compose<any>()(BusinessUnitsView)
// withFind({
//   collectionName: 'businessUnits',
//   getFilter,
//   uiStoreKey: 'businessUnits'
// })
