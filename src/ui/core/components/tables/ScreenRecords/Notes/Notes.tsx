import NotesView from './NotesView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'

const getFilter = (props: any) => {
  if (props.type == 'baseline') {
    return {
      // 'note._id': { $exists: true },
      // 'note.viewport.userSimulationId': { $eq: props.userSimulationId },
      'viewports.0.userSimulationId': props.userSimulationId,
      // 'note.isDeleted': false,
    }
  } else {
    return {
      // 'note._id': { $exists: true },
      // 'note.viewport.userSimulationId': { $eq: props.userSimulationId },
      'viewports.0.userSimulationId': props.userSimulationId,
      // 'note.isDeleted': false,
    }
  }
}

export default compose<any>(
  withFind({
    collectionName: 'logs',
    getFilter: getFilter,
    version: 2,
  })
)(NotesView)
