import compose from '@shopify/react-compose'
import FilesView from './FoldersView'
import { withFind } from '@hocs'
import withProps from './withProps'

const getFoldersFilter = () => ({
  depth: 0,
  isDeleted: false,
})

const getDocsFilter = () => ({
  isDeleted: false,
})

const getOptions = () => ({
  sort: {
    parentId: -1,
    createdAt: -1,
  },
})
  
export default compose<any>(
  withFind({
    collectionName: 'folders',
    getFilter: getFoldersFilter,
    getOptions,
  }),
  withFind({
    collectionName: 'docs',
    getFilter: getDocsFilter,
    getOptions,
  }),
  withProps
)(FilesView)
