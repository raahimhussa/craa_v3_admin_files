import { TextFieldProps } from '@mui/material/TextField'
import UnitSelectView from './UnitSelectView'
import compose from '@shopify/react-compose'

export default compose<
  TextFieldProps & {
    state?: any
    path?: string
    unit?: string
  }
>()(UnitSelectView)
