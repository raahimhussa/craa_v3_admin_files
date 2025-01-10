import KeyConceptsView from './KeyConceptsView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'

const keyConceptFilter = () => ({
  isDeleted: false,
})

const domainFilter = () => ({
  depth: 0,
  followupNumber: { $gt: 0 },
  isDeleted: false,
})

export default compose<any>(
  withFind({
    collectionName: 'keyConcepts',
    getFilter: keyConceptFilter,
    version: 2,
    uiStoreKey: 'keyConcepts',
  }),
  withFind({
    collectionName: 'domains',
    getFilter: domainFilter,
    version: 2,
  })
)(KeyConceptsView)
