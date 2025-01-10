import FindingsView from './FindingsView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'

const getFindingsFilter = (props: { simDoc: any }) => ({
  simDocId: props.simDoc?._id,
  isDeleted: false,
})

export default compose<any>(
  withFind({
    collectionName: 'findings',
    getFilter: getFindingsFilter,
    version: 2,
    uiStoreKey: 'findings',
  })
)(FindingsView)
