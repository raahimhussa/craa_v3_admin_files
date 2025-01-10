import { withState } from '@hocs'
import compose from '@shopify/react-compose'
import ProfileCardView from './ProfileCardView'

const getState = () => ({})
export default compose<any>(withState(getState))(ProfileCardView)
