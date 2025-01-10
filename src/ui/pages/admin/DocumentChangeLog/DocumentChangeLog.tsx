import DocumentChangeLogView from './DocumentChangeLogView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'

const getFilter = () => ({
  // isDeleted: { $eq: false },
  screen: 'pdfFiles'
})

export default compose<any>()(DocumentChangeLogView)
