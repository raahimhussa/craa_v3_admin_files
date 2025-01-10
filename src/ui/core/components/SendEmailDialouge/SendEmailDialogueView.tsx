import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

import RUnitSelectText from '@components/RUnitSelectText/RUnitSelectText'
import React from 'react'
import { observer } from 'mobx-react'
import { useSnackbar } from 'notistack'

type SendEmailDialogueProps = {
  open: boolean
  handleClose: () => void
  onSend: () => void
  title: string
  text: string
  yesText: string
  noText: string
  unit: string
  onChangeText: (text: string) => void
  value: string
}

function SendEmailDialogueView({
  open,
  handleClose,
  onSend,
  title,
  text,
  yesText,
  noText,
  unit,
  onChangeText,
  value,
}: SendEmailDialogueProps) {
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
        <Box sx={{ mt: 2, mr: 2 }}>
          <RUnitSelectText
            fullWidth
            value={value}
            onChangeText={onChangeText}
            unit={unit}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{noText}</Button>
        <Button
          onClick={async () => {
            try {
              await handleClose()
              await onSend()
              enqueueSnackbar('Email was sent successfully', {
                variant: 'success',
              })
            } catch (e) {
              console.error(e)
              enqueueSnackbar('Sending Email failed', { variant: 'error' })
            }
          }}
          variant="contained"
          color="primary"
          autoFocus
        >
          {yesText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
export default observer(SendEmailDialogueView)
