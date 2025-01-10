import DomainsView from './DomainsView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'

const getFilter = ({
  depth,
  parentId,
}: {
  depth: number
  parentId: string
}) => ({
  parentId,
  depth,
  isDeleted: false,
})

export default compose<any>(
  withFind({
    collectionName: 'domains',
    getFilter,
    uiStoreKey: 'domains',
    version: 2,
  })
)(DomainsView)
