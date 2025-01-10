import RUnitSelectNumberView from './RUnitSelectNumberView'
import { TextFieldProps } from '@mui/material/TextField'
import compose from '@shopify/react-compose'

export default compose<
  TextFieldProps & {
    value?: number
    onChangeNumber?: (amount: number) => void
    unit?: string
    disabled?: boolean
  }
>()(RUnitSelectNumberView)
