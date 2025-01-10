import IFolder from 'src/models/folder/folder.interface'
import SimDocsView from './SimDocsView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
import withHandler from './withHandler'
const getFoldersFilter = () => {
  return {
    isDeleted: false,
  }
}

export default compose<any>(
  withFind({
    collectionName: 'simulations',
    getFilter: () => ({
      isDeleted: false,
    }),
  }),
  withFind({
    collectionName: 'folders',
    version: 2,
    getFilter: getFoldersFilter,
  }),
  withFind({
    collectionName: 'domains',
    getFilter: () => ({
      depth: 1,
    }),
    version: 2,
  }),
  withHandler
)(SimDocsView)
