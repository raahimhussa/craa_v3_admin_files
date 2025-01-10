import FileSelectView from './FileSelectView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
import withFindOne from 'src/hocs/withFindOne'

export default compose<any>(
  withFind({
    collectionName: 'files',
    getFilter: () => {
      return {
        mimeType: 'application/pdf',
        isDeleted: false,
      }
    },
    getOptions: () => ({
      sort: {
        createdAt: -1,
      },
    }),
  })
)(FileSelectView)
