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

type DuplicateDialogueProps = {
  open: boolean
  handleClose: () => void
  onDuplicate: () => void
  title: string
  text: string
  yesText: string
  noText: string
  unit: string
  onChangeText: (text: string) => void
  value: string
}

function DuplicateDialogueView({
  open,
  handleClose,
  onDuplicate,
  title,
  text,
  yesText,
  noText,
  unit,
  onChangeText,
  value,
}: DuplicateDialogueProps) {
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
              await onDuplicate()
              enqueueSnackbar('Duplicated successfully', { variant: 'success' })
            } catch (e) {
              console.error(e)
              enqueueSnackbar('Duplicated failed', { variant: 'error' })
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
export default observer(DuplicateDialogueView)
