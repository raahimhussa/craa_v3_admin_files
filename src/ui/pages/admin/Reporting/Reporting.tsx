import ReportingView from './ReportingView'
import UserSimulation from 'src/models/userSimulation'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
import withREST from 'src/hocs/withREST'
import withUiStore from 'src/hocs/withUiStore'

export default compose<any>(
  withUiStore('modal'),
  withREST({
    collectionName: 'dataDump',
    path: ({ userId }: { userId: string }) => {
      return `users/${userId}/userCard`
    },
    propName: 'userCardData',
    version: 3,
  }),
  withFind({
    collectionName: 'domains',
    version: 2,
    getFilter: () => ({
      isDeleted: false,
      followupNumber: { $gt: 0 },
      depth: 0,
    }),
  })
)(ReportingView)
