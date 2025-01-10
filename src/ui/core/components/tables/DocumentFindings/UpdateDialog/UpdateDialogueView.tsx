import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

import React from 'react'
import { observer } from 'mobx-react'
import { useSnackbar } from 'notistack'

type DeleteDialogueProps = {
  open: boolean
  handleClose: () => void
  onUpdate: () => void
  title: string
  text: string
  yesText: string
  noText: string
}

function UpdateDialogueView({
  open,
  handleClose,
  onUpdate,
  title,
  text,
  yesText,
  noText,
}: DeleteDialogueProps) {
  const { enqueueSnackbar } = useSnackbar()

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{noText}</Button>
        <Button
          onClick={async () => {
            try {
              handleClose()
              await onUpdate()
              enqueueSnackbar('Updated successfully', { variant: 'success' })
            } catch (e) {
              console.error(e)
              enqueueSnackbar('Update failed', { variant: 'error' })
            }
          }}
          variant="contained"
          color="error"
          autoFocus
        >
          {yesText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
export default observer(UpdateDialogueView)
