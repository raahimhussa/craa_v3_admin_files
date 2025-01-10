import EditUserView from './EditUserView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
const getFilesFilter = () => ({
  isDeleted: false,
})
export default compose<any>(
  withFind({ collectionName: 'roles' }),
  withFind({ collectionName: 'clientUnits', getFilter: getFilesFilter }),
  withFind({ collectionName: 'countries', getFilter: getFilesFilter })
  // withFind({ collectionName: 'businessUnits', getFilter: getFilesFilter })
)(EditUserView)
