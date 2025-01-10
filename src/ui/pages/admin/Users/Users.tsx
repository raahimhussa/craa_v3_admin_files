import UsersView from './UsersView'
import compose from '@shopify/react-compose'
import withFindOne from 'src/hocs/withFindOne'
export default compose(
  withFindOne({
    collectionName: 'roles',
    getFilter: () => ({
      isDeleted: false,
      priority: 0,
    }),
  })
)(UsersView)
