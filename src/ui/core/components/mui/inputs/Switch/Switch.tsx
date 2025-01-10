import compose from '@shopify/react-compose'
import SwitchView from './SwitchView'
import { SwitchProps as MuiSwitchProps } from '@mui/material'

export type SwitchProps = MuiSwitchProps & {
  state: any
  path: string
}

export default compose<SwitchProps>()(SwitchView)
