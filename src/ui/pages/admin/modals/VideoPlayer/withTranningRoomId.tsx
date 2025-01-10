import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
const withTrainingRoomId = (WrappedComponent: any) =>
  observer((props: any) => {
    const { modalStore } = useRootStore()
    const trainingRoom = modalStore.videoPlayer.trainingRoom
    return <WrappedComponent {...props} trainingRoomId={trainingRoom._id} />
  })

export default withTrainingRoomId
