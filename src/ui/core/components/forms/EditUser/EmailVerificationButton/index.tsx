import { Box, Button, InputLabel, TextField } from '@mui/material'
import { ContentCopy, Send } from '@mui/icons-material'
import React, { useState } from 'react'

import SendEmailDialogue from '@components/SendEmailDialouge/SendEmailDialogue'
import axios from 'axios'
import { useSnackbar } from 'notistack'

type Props = {
  defaultEmail?: string
  user: any
}

export const EmailVerificationButton = ({ defaultEmail, user }: Props) => {
  const [open, setOpen] = useState<boolean>(false)
  const [email, setEmail] = useState<string>(defaultEmail ? defaultEmail : '')
  const { enqueueSnackbar } = useSnackbar()

  const onClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onChangeText = (text: string) => {
    setEmail(text)
  }

  const onSend = async () => {
    await axios.post('v1/auth/verifyEmail', { ...user, email })
  }

  const onClickCopy = () => {
    if (!user.emailVerificationLink) {
      return alert(
        'Email verification link is not available. Please try again after sending verification email.'
      )
    }
    try {
      navigator.clipboard.writeText(user.emailVerificationLink)
      enqueueSnackbar('Email verification link is copied', {
        variant: 'success',
      })
    } catch (e) {
      console.error(e)
      enqueueSnackbar('Copying email verification link failed', {
        variant: 'error',
      })
    }
  }

  return (
    <>
      <InputLabel
        sx={{
          mb: 1,
          mt: 2,
        }}
      >
        Email Verification
      </InputLabel>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          onClick={onClickOpen}
          size="small"
          variant="outlined"
          sx={{
            height: '36px !important',
          }}
        >
          <Send />
        </Button>
        <Button
          onClick={onClickCopy}
          size="small"
          variant="outlined"
          sx={{
            height: '36px !important',
          }}
        >
          <ContentCopy />
        </Button>
        <TextField
          disabled
          fullWidth
          value={user.emailVerificationLink ? user.emailVerificationLink : ''}
          sx={{ height: 28 }}
        />
      </Box>
      <SendEmailDialogue
        open={open}
        handleClose={handleClose}
        onSend={onSend}
        title={'Are you sure you want to send email to reset password by user?'}
        text={''}
        yesText={'Send Email'}
        noText={'Cancel'}
        unit={'Email'}
        onChangeText={onChangeText}
        value={email}
      />
    </>
  )
}
