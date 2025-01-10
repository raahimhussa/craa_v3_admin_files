import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Input,
  InputLabel,
} from '@mui/material'
import React, { useState } from 'react'

import RUnitSelectNumber from '@components/RUnitSelectNumber/RUnitSelectNumber'
import UnitSelect from '@components/UnitSelect/UnitSelect'
import { observer } from 'mobx-react'
import { useSnackbar } from 'notistack'

type ReallocateDialogueProps = {
  open: boolean
  handleClose: () => void
  onReopen: (additionalTestTime: number, additionalAttemptCount: number) => void
  title: string
  text: string
  yesText: string
  noText: string
  usageTime: number
  testTime: number
  attemptCount: number
}

function ReallocateDialogueView({
  open,
  handleClose,
  onReopen,
  title,
  text,
  yesText,
  noText,
  usageTime,
  testTime,
  attemptCount,
}: ReallocateDialogueProps) {
  const { enqueueSnackbar } = useSnackbar()
  const [additionalTestTime, setAdditionalTestTime] = useState<number>(0)
  const [additionalAttemptCount, setAdditionalAttemptCount] =
    useState<number>(0)

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
        <Divider />
        <DialogContentText id="alert-dialog-description">
          <Box sx={{ display: 'flex', mt: 1, mb: 1 }}>
            <Box sx={{ mr: 1, width: 160 }}>
              <InputLabel sx={{ mb: 1 }}>Assigned Test Time</InputLabel>
              <RUnitSelectNumber
                value={testTime}
                unit={'hour'}
                onChangeNumber={(amount) => setAdditionalTestTime(amount)}
                disabled={true}
              />
            </Box>
            <Box sx={{ mr: 1, width: 160 }}>
              <InputLabel sx={{ mb: 1 }}>Usage Time</InputLabel>
              <RUnitSelectNumber
                value={usageTime}
                unit={'hour'}
                onChangeNumber={(amount) => setAdditionalTestTime(amount)}
                disabled={true}
              />
            </Box>
            <Box sx={{ mr: 1, width: 160 }}>
              <InputLabel sx={{ mb: 1 }}>Left Session Count</InputLabel>
              <RUnitSelectNumber
                value={attemptCount}
                unit={'times'}
                onChangeNumber={(amount) => setAdditionalAttemptCount(amount)}
                disabled={true}
              />
            </Box>
          </Box>
        </DialogContentText>
        <Divider />
        <DialogContentText id="alert-dialog-description">
          <Box sx={{ display: 'flex', mt: 1 }}>
            <Box sx={{ mr: 1, width: 160 }}>
              <InputLabel sx={{ mb: 1 }}>Additional Test Time</InputLabel>
              <RUnitSelectNumber
                value={additionalTestTime}
                unit={'hour'}
                onChangeNumber={(amount) => setAdditionalTestTime(amount)}
              />
            </Box>
            <Box sx={{ width: 160 }}>
              <InputLabel sx={{ mb: 1 }}>Additional Session Count</InputLabel>
              <RUnitSelectNumber
                value={additionalAttemptCount}
                unit={'times'}
                onChangeNumber={(amount) => setAdditionalAttemptCount(amount)}
              />
            </Box>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{noText}</Button>
        <Button
          onClick={async () => {
            try {
              await handleClose()
              await onReopen(additionalTestTime, additionalAttemptCount)
              enqueueSnackbar('Re-allocated successfully', {
                variant: 'success',
              })
            } catch (e) {
              console.error(e)
              enqueueSnackbar('Re-allocate failed', { variant: 'error' })
            }
          }}
          variant="contained"
          color="warning"
          autoFocus
        >
          {yesText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
export default observer(ReallocateDialogueView)
