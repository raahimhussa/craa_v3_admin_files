import MigrationView from './MigrationView'
import compose from '@shopify/react-compose'
import withREST from 'src/hocs/withREST'

const getFilter = () => ({
  isDeleted: false,
})

export default compose<any>(
  withREST({
    collectionName: 'migrations',
    version: 3,
    path: () => 'info',
    propName: 'info',
  }),
  withREST({
    collectionName: 'systemSettings',
    version: 1,
    path: () => 'demoVersion',
    propName: 'demoVersion',
  })
)(MigrationView)
