import { withState } from '@hocs'
import compose from '@shopify/react-compose'
import withPayload from 'src/hocs/withPayload'
import CategoryItemView from './CategoryItemView'

const getState = (props: any) => ({
  categoryItem: props.categoryItem,
})

export default compose<any>(withPayload('categoryItem'), withState(getState))(CategoryItemView)
