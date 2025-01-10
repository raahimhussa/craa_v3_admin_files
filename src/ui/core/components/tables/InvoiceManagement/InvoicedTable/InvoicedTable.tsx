import { withFind, withState } from '@hocs'

import InvoicedTableView from './InvoicedTableView'
import compose from '@shopify/react-compose'
import withColumns from './withColumns'
import withLeftButtons from './withLeftButtons'
import withRightButtons from './withRightButtons'

const getState = () => ({
  selectedRowIds: [],
})

export default compose<any>(
  withState(getState),
  withFind({
    collectionName: 'countries',
    getFilter: () => ({ isDeleted: false }),
  }),
  withColumns,
  withLeftButtons,
  withRightButtons
)(InvoicedTableView)
