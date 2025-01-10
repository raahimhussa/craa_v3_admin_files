import { withFind, withState } from '@hocs'
import compose from '@shopify/react-compose'
import pluralize from 'pluralize'
import CellSelectView from './CellSelectView'

const getState = (props: any) => {
  const singularCollectionName = pluralize.singular(props.column.collectionName)
  return {
    [singularCollectionName]: props.row.original,
  }
}

const getCollectionName = (props: any) => props.column.optionCollectionName

export default compose<any>(
  withFind({ collectionName: getCollectionName }),
  withState(getState)
)(CellSelectView)
