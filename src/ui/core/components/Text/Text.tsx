import { TypographyProps as MuiTypographyProps } from '@mui/material'
import compose from '@shopify/react-compose'
import TextView from './TextView'

type TypographyProps = MuiTypographyProps & {
  component?: any
}

export default compose<TypographyProps>()(TextView)
