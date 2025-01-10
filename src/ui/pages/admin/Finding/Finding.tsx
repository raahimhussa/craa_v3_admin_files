import FindingView from './FindingView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
export default compose<any>(
  withFind({
    collectionName: 'simDocs',
    getFilter: () => ({ isDeleted: false }),
    version: 1,
  }),
  withFind({
    collectionName: 'domains',
    getFilter: () => ({ isDeleted: false }),
    version: 2,
  }),
  withFind({
    collectionName: 'simulations',
    getFilter: () => ({ isDeleted: false }),
    version: 1,
  }),
  withFind({
    collectionName: 'folders',
    getFilter: () => ({ isDeleted: false }),
    version: 2,
  }),
  withFind({
    collectionName: 'simulationMappers',
    getFilter: (props: any) => {
      return {
        isDeleted: false,
        findingId: props.findingVisibleId,
      }
    },
    version: 3,
  })
)(FindingView)
