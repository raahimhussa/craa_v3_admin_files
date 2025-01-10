import compose from '@shopify/react-compose'
import SystemSettingsView from './SystemSettingsView'
import { withFind } from '@hocs'

const getFilter = () => ({
  isDeleted: false,
})

export default compose<any>()(SystemSettingsView)
