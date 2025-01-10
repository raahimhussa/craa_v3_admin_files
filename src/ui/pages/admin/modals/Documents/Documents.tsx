import compose from '@shopify/react-compose'
import DocumentsView from './DocumentsView'
import withPayload from 'src/hocs/withPayload'

export default compose<any>(withPayload('documents'))(DocumentsView)
