import { Box, Modal } from '@mui/material'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
function ModalMountView() {
  const {
    uiState: { modal },
    uiState,
  } = useRootStore()
  return (
    <Modal
      disableEnforceFocus
      onClose={() => modal.close()}
      open={modal.isVisible}
    >
      <Box>{modal.children}</Box>
    </Modal>
  )
}
export default observer(ModalMountView)
