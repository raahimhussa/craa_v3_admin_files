import ScreenRecordsView from './ScreenRecordsView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
import withFindOne from 'src/hocs/withFindOne'

export default compose<any>(
  withFindOne({
    collectionName: 'screenRecorders',
    version: 2,
    getFilter: (props: any) => ({
      userSimulationId: props.userSimulation?._id,
    }),
  })
)(ScreenRecordsView)
