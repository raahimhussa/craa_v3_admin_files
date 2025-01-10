import { withFind, withState } from '@hocs'

import ProtocolView from './ProtocolView'
import compose from '@shopify/react-compose'
import withPayload from 'src/hocs/withPayload'

const getState = (props: any) => {
  const state = {
    selectedRowIds: [],
  }
  return state
}

const getFilesFilter = () => ({
  isDeleted: false,
  mimeType: 'application/pdf',
})

export default compose<any>(
  withPayload('protocol'),
  withFind({ collectionName: 'files', getFilter: getFilesFilter }),
  withState(getState)
)(ProtocolView)
