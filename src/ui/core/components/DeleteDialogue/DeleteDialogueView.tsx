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
  handleClose: (e: any) => void
  onDelete: () => void
  title: string
  text: string
  yesText: string
  noText: string
  disableSnackbar?: boolean
}

function DeleteDialogueView({
  open,
  handleClose,
  onDelete,
  title,
  text,
  yesText,
  noText,
  disableSnackbar,
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
          onClick={async (e) => {
            try {
              handleClose(e)
              await onDelete()
              if (disableSnackbar) return
              enqueueSnackbar('Deleted successfully', { variant: 'success' })
            } catch (e) {
              console.error(e)
              if (disableSnackbar) return
              enqueueSnackbar('Deleted failed', { variant: 'error' })
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
export default observer(DeleteDialogueView)
