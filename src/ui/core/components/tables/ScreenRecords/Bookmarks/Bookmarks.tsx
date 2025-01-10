import BookmarksView from './BookmarksView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
const getBookmarksFilter = (props: { userSimulationId: string }) => ({
  userSimulationId: props.userSimulationId,
  isDeleted: false,
})

export default compose<any>(
  withFind({
    collectionName: 'bookmarks',
    getFilter: getBookmarksFilter,
    getOptions: () => ({
      sort: {
        createdAt: -1,
      },
    }),
    version: 2,
  }),
  withFind({
    collectionName: 'logs',
    getFilter: getBookmarksFilter,
    version: 2,
  })
)(BookmarksView)
