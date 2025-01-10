import { withState } from '@hocs'
import compose from '@shopify/react-compose'
import withFindOne from 'src/hocs/withFindOne'
import VideoPlayerView from './VideoPlayerView'
import withHandler from './withHandler'
// import withTrainingRoomId from './withTrainingRoomId'
const getState = (props: any) => {
  const { trainingRoom } = props
  return ({
    note: {
      open: false,
      kind: 'bookmark',
      content: '',
      timestamp: 0
    },
    userId: '',
    content: '',
    currentButtonText: 'NOTE', //'BOOKMARKS, EVENTLOGS
    trainingRoom: trainingRoom,
  })
}

const getFilter = (props: any) => {
  const { trainingRoomId } = props
  return (
    { trainingRoomId }
  )
}

export default compose<any>(
  // withTrainingRoomId,
  withFindOne({
    collectionName: 'trainingRooms',
    getFilter
  }),
  withState(getState),
  withHandler,
)(VideoPlayerView)
