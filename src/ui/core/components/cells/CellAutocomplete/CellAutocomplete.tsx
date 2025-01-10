import { withFind, withState } from '@hocs'
import compose from '@shopify/react-compose'
import pluralize from 'pluralize'
import CellAutocompleteView from './CellAutocompleteView'

const getState = (props: any) => {
  const singularCollectionName = pluralize.singular(props.column.collectionName)
  return {
    [singularCollectionName]: props.row.original,
  }
}

const getCollectionName = (props: any) => props.column.optionCollectionName

const getFilter = () => ({
  isDeleted: false,
})

export default compose<any>(
  withFind({ collectionName: getCollectionName, getFilter }),
  withState(getState)
)(CellAutocompleteView)
