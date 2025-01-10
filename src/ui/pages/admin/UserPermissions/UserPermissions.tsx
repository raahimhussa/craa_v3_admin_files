import UserPermissionsView from './UserPermissionsView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'

export default compose<any>(
  withFind({
    collectionName: 'roles',
    getFilter: () => ({
      isDeleted: false,
    }),
  }),
  withFind({
    collectionName: 'clientUnits',
    getFilter: () => ({
      isDeleted: false,
      // vendor: '',
    }),
  })
)(UserPermissionsView)
