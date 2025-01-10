import FoldersView from './FoldersView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'

export default compose<any>(
  withFind({
    collectionName: 'folders',
    version: 2,
    getFilter: (props: any) => {
      console.log(props.userSimulation)
      return {
        _id: {
          $in: props.userSimulation?.simulation?.folderIds,
        },
      }
    },
  })
)(FoldersView)
