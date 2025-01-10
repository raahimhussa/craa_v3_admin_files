import ImportFindingsView from './FindingsXlsxView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'

export default compose<any>(
  withFind({
    collectionName: 'simulations',
    version: 1,
    getFilter: () => ({
      isDeleted: false,
    }),
  }),
  withFind({
    collectionName: 'simDocs',
    version: 1,
    getFilter: () => ({
      isDeleted: false,
    }),
  }),
  withFind({
    collectionName: 'folders',
    version: 2,
    getFilter: () => ({
      isDeleted: false,
    }),
  }),
  withFind({
    collectionName: 'domains',
    version: 2,
    getFilter: () => ({
      isDeleted: false,
    }),
  }),
  withFind({
    collectionName: 'findings',
    version: 2,
    getFilter: () => ({
      isDeleted: false,
    }),
  }),
  withFind({
    collectionName: 'simulationMappers',
    version: 3,
    getFilter: () => ({
      isDeleted: false,
    }),
  })
)(ImportFindingsView)
