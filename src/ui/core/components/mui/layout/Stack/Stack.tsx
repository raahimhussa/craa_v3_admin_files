import compose from '@shopify/react-compose'
import StackView from './StackView'
import { StackProps as MuiStackProps } from '@mui/material'

export type StackProps = MuiStackProps & {}
export type StackViewProps = StackProps

export default compose<StackProps>()(StackView)
