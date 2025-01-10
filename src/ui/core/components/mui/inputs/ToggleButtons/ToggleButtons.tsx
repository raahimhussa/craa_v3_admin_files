import compose from '@shopify/react-compose'
import ToggleButtonsView from './ToggleButtonsView'
import { ToggleButtonGroupProps as MuiToggleButtonGroupProps } from '@mui/material'
export interface Item {
  text: string
  value: any
}

type ToggleButtonsProps = MuiToggleButtonGroupProps & {
  items: Array<Item>
  state?: any
  path?: string
}
export type ToggleButtonsViewProps = ToggleButtonsProps

export default compose<ToggleButtonsProps>()(ToggleButtonsView)
