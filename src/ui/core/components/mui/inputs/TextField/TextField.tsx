import compose from '@shopify/react-compose'
import TextFieldView from './TextFieldView'
import { TextFieldProps as MuiTextFieldProps } from '@mui/material'

type TextFieldProps = MuiTextFieldProps & { state?: any; path?: string; number?: boolean }

export default compose<TextFieldProps>()(TextFieldView)
