import compose from '@shopify/react-compose'
import { UploaderProps } from './types'
import DocumentBuilderView from './DocumentBuilderView'
import { withFind } from '@hocs'

export default compose<any>(
  withFind({
    collectionName: 'documentVariableGroups',
    getFilter: () => {
      return {
        isDeleted: false,
      }
    },
  })
)(DocumentBuilderView)
