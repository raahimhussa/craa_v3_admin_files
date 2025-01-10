import { withFind, withState } from '@hocs'

import RiskView from './RiskView'
import compose from '@shopify/react-compose'

const getState = () => {
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
  withFind({ collectionName: 'files', getFilter: getFilesFilter }),
  withState(getState)
)(RiskView)
