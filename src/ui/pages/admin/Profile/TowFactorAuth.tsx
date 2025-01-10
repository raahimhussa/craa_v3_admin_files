import { FC, useEffect, useState } from 'react'
import QRCode from 'qrcode'
import axios from 'axios'
import { useRootStore } from 'src/stores'
import {
  Card,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
} from '@mui/material'
import palette from 'src/theme/palette'
import { useSnackbar } from 'notistack'

type TwoFactorAuthProps = {
  otpauth_url: string
  base32: string
  user_id: string
  closeModal: any
  setIs2fa: any
}

const TwoFactorAuth: FC<TwoFactorAuthProps> = ({
  otpauth_url,
  base32,
  user_id,
  closeModal,
  setIs2fa,
}) => {
  const [qrcodeUrl, setqrCodeUrl] = useState('')
  const [token, setToken] = useState('')
  const { uiState, authStore } = useRootStore()
  const { enqueueSnackbar } = useSnackbar()

  const verifyOtp = async () => {
    try {
      const { data } = await axios.post('v1/users/otp/verify', {
        token,
        user_id,
      })
      if (data.status === 'success') {
        enqueueSnackbar('2FA activated', {
          variant: 'success',
        })
        setIs2fa(true)
        // authStore.user.otpData.otp_enabled = true
        // authStore.user.otpData.otp_verified = true
        closeModal()
      } else {
        alert('Please check your verify code.')
      }
    } catch (error: any) {
      enqueueSnackbar('2FA generating failed', {
        variant: 'error',
      })
      console.log(error)
    }
  }

  useEffect(() => {
    try {
      QRCode.toDataURL(otpauth_url, function (err: any, url: any) {
        setqrCodeUrl(url)
      })
      //   QRCode.toDataURL(otpauth_url).then(setqrCodeUrl);
    } catch (error) {
      console.log(error)
    }
  }, [otpauth_url])

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: '10px !important',
        bgcolor: 'white',
      }}
    >
      <Typography variant="h5">Two-Factor Authentication (2FA)</Typography>
      <Divider />
      <Typography
        sx={{
          color: palette.light.button.orange,
          mb: 0.3,
          mt: 2,
          fontWeight: 600,
        }}
      >
        Configuraing Google Authenticator or Authy
      </Typography>
      <Divider sx={{ mb: 1 }} />
      <Typography sx={{ fontSize: '14px' }}>
        1. Install Google Authenticator (IOS - Android) or Authy (IOS -
        Android).
      </Typography>
      <Typography sx={{ fontSize: '14px' }}>
        2. In the authenticator app, select '+' icon.
      </Typography>
      <Typography sx={{ fontSize: '14px' }}>
        3. Select "Scan a barcode (or QR code)" and use the phone's camera to
        scan this barcode.
      </Typography>
      <Typography
        sx={{
          color: palette.light.button.orange,
          mb: 0.3,
          mt: 2,
          fontWeight: 600,
        }}
      >
        Scan QR Code
      </Typography>
      <Divider />
      <Box
        sx={{
          width: '100%',
          textAlign: 'center',
        }}
      >
        <img src={qrcodeUrl} alt="qrcode url" width={'250px'} />
      </Box>
      <Typography
        sx={{
          color: palette.light.button.orange,
          mb: 0.3,
          mt: 2,
          fontWeight: 600,
        }}
      >
        Verify Code
      </Typography>
      <Divider sx={{ mb: 1 }} />
      <TextField
        size="small"
        placeholder="Authentication Code"
        variant="outlined"
        value={token}
        onChange={(e: any) => {
          setToken(e.target.value)
        }}
      />
      <Box
        sx={{
          mt: 3,
          width: '100%',
          textAlign: 'right',
        }}
      >
        <Button
          className="outlinedBtn"
          variant="outlined"
          onClick={closeModal}
          sx={{
            boxShadow: 'none',
            borderRadius: '5px !important',
            mr: 1,
          }}
        >
          Close
        </Button>
        <Button
          variant="contained"
          onClick={verifyOtp}
          sx={{
            boxShadow: 'none',
            borderRadius: '5px !important',
          }}
        >
          Verify & Activate
        </Button>
      </Box>
    </Box>
  )
}

export default TwoFactorAuth
