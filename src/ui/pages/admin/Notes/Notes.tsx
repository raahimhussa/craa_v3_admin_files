import compose from '@shopify/react-compose'
import NotesView from './NotesView'
import { withFind, withState } from '@hocs'
import withColumns from './withColumns'
import withLeftButtons from './withLeftButtons'
import withRightButtons from './withRightButtons'

const getState = () => ({
  selectedRowIds: [],
})

export default compose<any>(
  withFind({
    collectionName: 'notes'
  }),
  withState(getState),
  withColumns,
  withLeftButtons,
  withRightButtons
)(NotesView)
