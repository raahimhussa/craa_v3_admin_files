import Modal from "@mui/material/Modal"
import { observer } from "mobx-react"
import { useRootStore } from "src/stores"

const BookmarkEdit = () => {
  const { modalStore } = useRootStore()
  return (
    <Modal open={modalStore.bookmark.isVisible} onClose={() => modalStore.bookmark.close()}>
      <div>HI</div>
    </Modal>
  )
}

export default observer(BookmarkEdit)