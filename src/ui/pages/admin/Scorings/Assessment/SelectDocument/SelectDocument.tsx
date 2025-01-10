import { withFind } from '@hocs'
import compose from '@shopify/react-compose'
import _ from 'lodash'
import withFindOne from 'src/hocs/withFindOne'
import ISimulation from 'src/models/simulation/simulation.interface'
import SelectDocumentView from './SelectDocumentView'

const getSimulationFilter = (props: {
  simulationId: string
}) => {
  return ({ _id: props.simulationId })
}

const getFoldersFilter = (props: {
  simulation: ISimulation
}) => {
  return ({
    _id: {
      $in: props.simulation.folderIds
    },
    isDeleted: false
  })
}

export default compose<any>(
  withFindOne({
    collectionName: 'simulations',
    getFilter: getSimulationFilter,
  }),
  withFind({
    collectionName: 'folders',
    getFilter: getFoldersFilter,
    version: 2,
  })
)(SelectDocumentView)