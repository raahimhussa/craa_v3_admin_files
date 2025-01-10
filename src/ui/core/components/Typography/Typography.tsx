import { TypographyProps as MuiTypographyProps } from '@mui/material'
import compose from '@shopify/react-compose'
import TypographyView from './TypographyView'

type TypographyProps = MuiTypographyProps & {
  component?: any
}

export default compose<TypographyProps>()(TypographyView)
