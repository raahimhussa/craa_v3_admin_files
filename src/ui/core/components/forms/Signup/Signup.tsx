import compose from '@shopify/react-compose'
import SignupView from './SignupView'
import { withState } from '@hocs'
import withMeta from './withMeta'
import withHandler from './withHandler'

const getState = () => ({
  step: 0,
  isChecked: false,
  isLoading: false,
  user: {
    email: '',
    username: '',
    password: '',
    passwordConfirm: '',
    profile: {
      lastName: '',
      firstName: '',
    },
  },
})

export default compose<any>(withState(getState), withHandler, withMeta)(SignupView)
