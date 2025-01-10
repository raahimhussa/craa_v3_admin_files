import { withState } from '@hocs'
import compose from '@shopify/react-compose'
import withPayload from 'src/hocs/withPayload'
import CategoryView from './CategoryView'

export enum CategoryKind {
  Domain = 'domain',
  Folder = 'folder',
}

const getState = (props: any) => {
  const { isEditMode, row } = props
  const category = { ...row }
  return {
    category: isEditMode
      ? category
      : {
        kind: CategoryKind.Domain,
        items: [],
        flattedItems: [],
      },
  }
}

export default compose<any>(withPayload('category'), withState(getState))(CategoryView)
