import BusinessUnitView from './BusinessUnitView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
import withFindOne from 'src/hocs/withFindOne'

const getAssessmentCyclesFilter = () => ({
  isDeleted: false,
})

export default compose<any>(
  // withProps,
  withFind({ collectionName: 'countries' }),
  withFind({
    collectionName: 'assessmentCycles',
    getFilter: getAssessmentCyclesFilter,
  }),
  withFind({ collectionName: 'domains', version: 2 }),
  withFindOne({ collectionName: 'settings', version: 2 })
)(BusinessUnitView)
