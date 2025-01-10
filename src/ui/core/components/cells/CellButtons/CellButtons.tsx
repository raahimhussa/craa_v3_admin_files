import { ButtonProps } from '@mui/material'
import CelButtonsView from './CellButtonsView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
import withREST from 'src/hocs/withREST'
export default compose<ButtonProps>(
  withREST({
    collectionName: 'clientUnits',
    path: () => '',
  }),
  withFind({
    collectionName: 'assessmentCycles',
    getFilter: () => ({
      isDeleted: false,
    }),
  }),
  withFind({
    collectionName: 'assessmentTypes',
    getFilter: () => ({
      isDeleted: false,
    }),
  }),
  withFind({
    collectionName: 'simulationMappers',
    version: 3,
    getFilter: () => ({
      isDeleted: false,
    }),
  }),
  withFind({
    collectionName: 'simulations',
    getFilter: () => ({
      isDeleted: false,
    }),
  })
)(CelButtonsView)
