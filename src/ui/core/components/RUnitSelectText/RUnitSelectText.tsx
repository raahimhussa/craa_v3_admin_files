import RUnitSelectTextView from './RUnitSelectTextView'
import { TextFieldProps } from '@mui/material/TextField'
import compose from '@shopify/react-compose'

export default compose<
  TextFieldProps & {
    value?: string
    onChangeText?: (text: string) => void
    unit?: string
  }
>()(RUnitSelectTextView)
