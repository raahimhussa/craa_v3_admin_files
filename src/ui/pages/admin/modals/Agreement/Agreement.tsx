import { withFind, withState } from '@hocs'
import compose from '@shopify/react-compose'
import AgreementView from './AgreementView'

const getFilesFilter = () => ({
  isDeleted: false,
})

export default compose<any>(
  withFind({ collectionName: 'files', getFilter: getFilesFilter }),
)(AgreementView)
