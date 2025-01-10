import { withFind, withState } from '@hocs'
import compose from '@shopify/react-compose'
import withPayload from 'src/hocs/withPayload'
import FolderView from './FolderView'

const getState = (props: any) => {
  const { folder: payloadFolder } = props

  return {
    folder: {
      ...payloadFolder,
      name: '',
    },
    selectedRowIds: [],
    selectedDocs: [],
  }
}

const getFilesFilter = () => ({
  mimeType: 'application/pdf',
})

export default compose<any>(
  withPayload('folder'),
  withFind({
    collectionName: 'files',
    getFilter: getFilesFilter,
  }),
  withState(getState)
)(FolderView)
