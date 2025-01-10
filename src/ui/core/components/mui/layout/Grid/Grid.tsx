import { GridProps as MuiGridProps } from '@mui/material'
import compose from '@shopify/react-compose'
import GridView from './GridView'
type GridProps = MuiGridProps & {}
export default compose<GridProps>()(GridView)
