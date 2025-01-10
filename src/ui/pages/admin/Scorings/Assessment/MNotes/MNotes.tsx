import MNotesView from './MNotesView'
import UserSimulation from 'src/models/userSimulation'
import _ from 'lodash'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
import withREST from 'src/hocs/withREST'
// Followup의 경우 UserSimulationId로 찾아야합니다. 분기를 여기서 해야됩니다.
const getNotesFilter = (props: { userSimulation: UserSimulation }) => {
  return {
    'viewport.userSimulationId': props.userSimulation._id,
    MNID: { $ne: 0 },
    isDeleted: false,
  }
}

export default compose<any>(
  withFind({
    collectionName: 'notes',
    version: 2,
    getFilter: getNotesFilter,
  })
)(MNotesView)
