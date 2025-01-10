import compose from '@shopify/react-compose'
import CheckboxView from './CheckboxView'
import { CheckboxProps as MuiCheckboxProps } from '@mui/material'

export type CheckboxProps = MuiCheckboxProps & {
  state: any
  path: string
  left?: boolean
  center?: boolean
  right?: boolean
  label?: string
}

export default compose<CheckboxProps>()(CheckboxView)
