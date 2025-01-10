import FollowupResultsView from './FollowupResultsView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
import withREST from 'src/hocs/withREST'

const getFilter = ({
  currentDataDump,
}: {
  currentDataDump: {
    assessmentCycleId: string
    assessmentTypeId: string
    clientUnitId: string
    businessUnitId: string
    businessCycleId: string
  }
}) => ({
  isDeleted: false,
})

export default compose<any>(
  withREST({
    collectionName: 'dataDump',
    version: 3,
    path: () => 'followupDataDump',
    params: ({
      currentDataDump: {
        assessmentCycleId,
        assessmentTypeId,
        clientUnitId,
        businessUnitId,
        businessCycleId,
        domainId,
      },
    }) => {
      return {
        assessmentCycleId,
        assessmentTypeId,
        clientUnitId,
        businessUnitId,
        businessCycleId,
        domainId,
      }
    },
  })
  // withFind({
  //   collectionName: 'userSimulations',
  //   getFilter,
  //   version: 2,
  // })
)(FollowupResultsView)
