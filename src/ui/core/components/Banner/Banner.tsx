import compose from '@shopify/react-compose'
import BannerView from './BannerView'

type BannerProps = {
  src?: string
  h2: string
  h4: string
}

export default compose<BannerProps>()(BannerView)
