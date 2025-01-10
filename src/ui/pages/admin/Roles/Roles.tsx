import compose from '@shopify/react-compose'
import RolesView from './RolesView'
import { withFind } from '@hocs'

const getFilter = () => ({
  isDeleted: false,
})

export default compose<any>(
  withFind({
    collectionName: 'roles', getFilter, getOptions: () => ({
      sort: {
        priority: 1
      }
    })
  })
)(RolesView)
