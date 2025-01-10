import UserLogsView from './UserLogsView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'

const getFilesFilter = () => ({
  mimeType: 'application/pdf',
  isDeleted: false,
})

export default compose<any>()(UserLogsView)
