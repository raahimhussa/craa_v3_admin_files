import FindingSelectView from './FindingSelectView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
import withFindOne from 'src/hocs/withFindOne'

export default compose<any>(
  withFind({
    collectionName: 'findings',
    version: 2,
    getFilter: () => ({
      isDeleted: false,
    }),
  })
)(FindingSelectView)
