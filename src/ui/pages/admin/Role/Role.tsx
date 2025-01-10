import { withState } from '@hocs'
import compose from '@shopify/react-compose'
import RoleView from './RoleView'

const getState = () => {
  return {
    role: {
      title: '',
      systemTitle: '',
      priorityNo: 0,
    },
  }
}

export default compose<any>(withState(getState))(RoleView)
