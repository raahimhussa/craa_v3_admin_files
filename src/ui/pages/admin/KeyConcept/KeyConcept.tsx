import KeyConceptView from './KeyConceptView'
import _ from 'lodash'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'

const getDomainsFilter = () => ({
  isDeleted: false,
  depth: 0,
})

export default compose<any>(
  withFind({
    collectionName: 'domains',
    getFilter: getDomainsFilter,
    version: 2,
  })
)(KeyConceptView)
