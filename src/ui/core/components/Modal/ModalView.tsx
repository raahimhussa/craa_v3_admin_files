import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import { reaction } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react'
import { MobxUtil } from 'src/utils'

function ModalView({ state = {}, path = '', children, ...rest }: any) {
  const localState = useLocalObservable(() => ({
    open: MobxUtil._get(state, path) || false,
  }))

  reaction(
    () => localState.open,
    () => MobxUtil._set(state, path, localState.open)
  )

  reaction(
    () => MobxUtil._get(state, path),
    () => (localState.open = MobxUtil._get(state, path))
  )

  const onClose = () => (localState.open = false)

  return (
    <Modal
      {...rest}
      sx={{ p: 10 }}
      open={localState.open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box>{children}</Box>
    </Modal>
  )
}
export default observer(ModalView)
