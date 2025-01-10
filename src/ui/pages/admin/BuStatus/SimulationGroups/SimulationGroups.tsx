import SimulationGroupsView from './SimulationGroupsView'
import compose from '@shopify/react-compose'
import withFindOne from 'src/hocs/withFindOne'

const getFilter = ({ assessmentTypeId }: { assessmentTypeId: string }) => ({
  _id: assessmentTypeId,
  isDeleted: false,
})

export default compose<any>(
  withFindOne({
    collectionName: 'assessmentTypes',
    getFilter,
  })
)(SimulationGroupsView)
