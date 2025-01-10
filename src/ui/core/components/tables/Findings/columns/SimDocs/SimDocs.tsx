import SimDocsView from './SimDocsView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
export default compose<any>(
  withFind({
    collectionName: 'simDocs',
    getFilter: (props: any) => {
      return { isDeleted: false, _id: { $in: props.value } }
    },
    version: 1,
  })
)(SimDocsView)
