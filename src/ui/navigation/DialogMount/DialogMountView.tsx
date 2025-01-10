import { Close } from '@mui/icons-material'
import { AppBar, Button, Dialog, DialogActions, DialogContent, IconButton, Toolbar, Typography } from '@mui/material'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'

function DialogView({ }) {
  const { dialogStore } = useRootStore()

  const onClose = () => {
    dialogStore.dialog.isVisible = false
  }

  return (
    <Dialog fullScreen onBackdropClick={onClose} open={dialogStore.dialog.isVisible}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          {/* <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <Close />
          </IconButton> */}
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {dialogStore.dialog.title}
          </Typography>
          <Button autoFocus color="inherit" onClick={onClose}>
            Close
          </Button>
        </Toolbar>
      </AppBar>
      {dialogStore.dialog.content}
      <DialogActions>
        {dialogStore.dialog.buttons?.map((button: any) => {
          return (
            <Button color="success" variant="contained" onClick={button.onClick}>
              {button.text}
            </Button>
          )
        })}
      </DialogActions>
    </Dialog>
  )
}
export default observer(DialogView)
