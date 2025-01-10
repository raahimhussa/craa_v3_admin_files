import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
const withHandlers: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { modalStore, } = useRootStore()
    const { state } = props

    const onClickClose = () => {
      modalStore.videoPlayer.isVisible = false
      modalStore.videoPlayer.payload = null
    }

    const onClickAddBookmarkOrNote = async (kind: string) => {
      // videoStore.video?.current?.pause()
      state.note.kind = kind
      state.note.open = true
    }

    const handlers = {
      onClickClose: onClickClose,
      onClickAddBookmarkOrNote
    }
    return <WrappedComponent {...props} {...handlers} />
  })

export default withHandlers
