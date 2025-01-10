import { withState } from '@hocs'
import compose from '@shopify/react-compose'
import FileView from './FileView'

const getState = () => {
  return {
    file: {},
    files: [],
  }
}

export default compose<any>(withState(getState))(FileView)
