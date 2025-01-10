import SelectedDocumentView from './SelectedDocumentView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
import withFindOne from 'src/hocs/withFindOne'

export default compose<any>(
  withFindOne({
    collectionName: 'simDocs',
    getFilter: ({ simDocId }: { simDocId: string }) => {
      return {
        _id: simDocId,
      }
    },
  })
)(SelectedDocumentView)
