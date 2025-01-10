import compose from '@shopify/react-compose'
import { DetailedHTMLProps, HTMLAttributes } from 'react'
import SpacerView from './SpacerView'

export type SpacerProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  spacing: number
  row?: boolean
}

export default compose<SpacerProps>()(SpacerView)
