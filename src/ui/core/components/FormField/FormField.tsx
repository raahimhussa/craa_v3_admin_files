import { SxProps } from '@mui/material'
import compose from '@shopify/react-compose'
import FormFieldView from './FormFieldView'

export type FormFieldProps = {
  label?: string
  description?: string
  children: React.ReactNode
  sx?: SxProps
}
export type HocCompoentProps = {}
export type FormFieldViewProps = FormFieldProps & HocCompoentProps

export default compose<FormFieldProps>()(FormFieldView)
