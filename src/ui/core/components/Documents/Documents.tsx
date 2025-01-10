import compose from '@shopify/react-compose'
import DocumentsView from './DocumentsView'
import { withFind } from '@hocs'
import withPayload from 'src/hocs/withPayload'

export default compose<any>(
  withPayload('')
)(DocumentsView)
