import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import React, { useState } from 'react'

import RUnitSelectText from '@components/RUnitSelectText/RUnitSelectText'
import { observer } from 'mobx-react'
import { useSnackbar } from 'notistack'

type UpdateDialogueProps = {
  open: boolean
  handleClose: () => void
  onUpdate: () => void
  title: string
  text: string
  yesText: string
  noText: string
  unit: string
  onChangeText: (text: string) => void
  value: string
}

function UpdateDialogueView({
  open,
  handleClose,
  onUpdate,
  title,
  text,
  yesText,
  noText,
  unit,
  onChangeText,
  value,
}: UpdateDialogueProps) {
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
            onChangeText={(text) => onChangeText(text.replaceAll('/', ''))}
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
              await onUpdate()
              enqueueSnackbar('Updated successfully', { variant: 'success' })
            } catch (e) {
              console.error(e)
              enqueueSnackbar('Update failed', { variant: 'error' })
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
export default observer(UpdateDialogueView)
