import { withState } from '@hocs'
import compose from '@shopify/react-compose'
import HeaderView from './HeaderView'
import withHandler from './withHandler'

const getState = () => ({
  userEmail: 'USERNAME',
  userPassword: '1111',
})
export default compose<any>(withState(getState), withHandler)(HeaderView)
