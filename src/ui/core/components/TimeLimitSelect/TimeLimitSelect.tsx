import { TextFieldProps } from '@mui/material/TextField'
import compose from '@shopify/react-compose'
import TimeLimitSelectView from './TimeLimitSelectView'

export default compose<
  TextFieldProps & {
    state?: any
    path?: string
  }
>()(TimeLimitSelectView)
