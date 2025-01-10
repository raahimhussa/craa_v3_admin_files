import SimulationsView from './SimulationsView'
import compose from '@shopify/react-compose'
import { withState } from '@hocs'
import pluralize from 'pluralize'

const getState = (props: any) => {

//   const singularCollectionName = pluralize.singular(props.column.collectionName)

//   console.log("Simulations getState: ", props, singularCollectionName)
  console.log("Simulations getState: ", props)
  return {
    // [singularCollectionName]: props.row.original,
  }
}

export default compose<any>(
    withState(getState)
)(SimulationsView)
