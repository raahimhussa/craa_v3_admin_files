import {
  Box,
  Button,
  Card,
  Grid,
  Link,
  Typography,
  styled,
  InputLabel,
  TextField,
  Select,
  ListItem,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Modal,
  MenuItem,
  FormControl,
} from '@mui/material'
import { useEffect, useState } from 'react'
import _ from 'lodash'
import logoImg from 'public/logo/logo_full.png'
import { useRootStore } from 'src/stores'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { observer } from 'mobx-react'
import axios from 'axios'
import SaveIcon from '@mui/icons-material/Save'
import { useSnackbar } from 'notistack'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { Copyright } from '@components'
import palette from 'src/theme/palette'
import TwoFactorAuth from './TowFactorAuth'
import { ConstructionOutlined } from '@mui/icons-material'

function ProfileView(props: any) {
  const { uiState, authStore, routerStore } = useRootStore()
  const [user, setUser] = useState({
    name: '',
    firstName: '',
    lastName: '',
    monitoring: '',
    title: '',
  })
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [open, setOpen] = useState(false)
  const [titles, setTitles] = useState([])
  const [country, setCountry] = useState('')
  const [is2fa, setIs2fa] = useState(
    authStore.user?.otpData?.otp_enabled == undefined
      ? false
      : authStore.user?.otpData?.otp_enabled
  )
  const [secret, setSecret] = useState({
    otpauth_url: '',
    base32: '',
  })

  async function getTitles() {
    const params = {
      filter: { _id: authStore.user?.profile?.clientUnitId },
    }
    const { data } = await axios.get('v1/clientUnits', { params })
    setTitles(data[0]?.titles)
  }

  async function getCountry() {
    const params = {
      filter: { _id: authStore.user?.profile?.countryId },
    }
    const { data } = await axios.get('v1/countries', { params })
    setCountry(data.name)
  }

  async function getUser() {
    const params = {
      filter: { _id: authStore.user?._id },
    }
    const { data } = await axios.get('v1/users', { params })
    setUser({
      name: data?.name,
      firstName: data?.profile.firstName,
      lastName: data?.profile.lastName,
      monitoring: data?.profile.monitoring,
      title: data?.profile.title,
    })
  }

  useEffect(() => {
    getTitles()
    getCountry()
  }, [])

  useEffect(() => {
    setIs2fa(
      authStore.user?.otpData?.otp_enabled == undefined
        ? false
        : authStore.user?.otpData?.otp_enabled
    )
  }, [authStore.user?.otpData?.otp_enabled])

  const generateQrCode = async () => {
    const user_id = authStore.user._id
    const email = authStore.user.email
    try {
      const response = await axios.post('v1/users/otp/generate', {
        user_id,
        email,
      })
      console.log(response)
      if (response.status === 201) {
        setOpen(true)
        console.log({
          base32: response.data.base32,
          otpauth_url: response.data.otpauth_url,
        })
        setSecret({
          base32: response.data.base32,
          otpauth_url: response.data.otpauth_url,
        })
      }
    } catch (error: any) {
      console.log(error)
    }
  }

  const disableTwoFactorAuth = async () => {
    const user_id = authStore.user._id
    try {
      const { data } = await axios.post('v1/users/otp/disable', {
        user_id,
      })
      console.log(data)
      if (data.status === 'success') {
        authStore.user.otpData.otp_enabled = false
        setIs2fa(false)
        enqueueSnackbar('2FA Disabled.', {
          variant: 'success',
        })
      } else {
        enqueueSnackbar('2FA disabling failed.', {
          variant: 'error',
        })
      }
    } catch (error: any) {
      console.log(error)
      enqueueSnackbar('2FA disabling failed.', {
        variant: 'error',
      })
    }
  }

  useEffect(() => {
    getUser()
  }, [authStore.user])

  const { enqueueSnackbar } = useSnackbar()

  const changePassword = async () => {
    const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/

    if (!reg.test(password)) {
      alert('Please check the password rules.')
      return
    }

    try {
      await axios.patch('v1/users/password', {
        _id: authStore.user?._id,
        password,
      })
      enqueueSnackbar('password changed', {
        variant: 'success',
      })
    } catch (e) {
      console.error(e)
      enqueueSnackbar('failed to change password', {
        variant: 'error',
      })
    }
  }

  const onClickSave = async () => {
    try {
      await axios.patch('v1/users', {
        filter: {
          _id: authStore.user._id,
        },
        update: {
          'profile.firstName': user.firstName,
          'profile.lastName': user.lastName,
          'profile.monitoring': user.monitoring,
          'profile.title': user.title,
        },
      })
      // authStore.user.profile.firstName = user.firstName
      // authStore.user.profile.lastName = user.lastName
      // authStore.user.profile.monitoring = user.monitoring
      // authStore.user.profile.title = user.title
      // routerStore.go('/users/userManagement')
      location.href = '/admin/users/userManagement'
    } catch (error) {
      console.log(error)
    }
  }

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
  }

  return (
    <Box sx={{ position: 'relative', height: '100vh' }}>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false)
        }}
      >
        <Box sx={style}>
          <TwoFactorAuth
            setIs2fa={setIs2fa}
            base32={secret.base32}
            otpauth_url={secret.otpauth_url}
            user_id={authStore.user?._id}
            closeModal={() => {
              setOpen(false)
            }}
          />
        </Box>
      </Modal>
      <Grid
        container
        spacing={2}
        sx={{
          px: 5,
          py: 2,
          height: uiState.windowDimensions?.height! - 60,
          // overflowY: 'scroll !important',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography
          sx={{
            width: '500px',
            margin: '0 auto',
            pb: 1,
            pl: 0.5,
          }}
          variant="h5"
        >
          Profile
        </Typography>
        <Card
          sx={{
            width: '500px',
            margin: '0 auto',
            py: 3,
            px: 3,
            // maxHeight: '600px',
            height: '85%',
            overflowY: 'auto',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              textAlign: 'right',
            }}
          >
            <Typography variant="button">*Field must not be empty.</Typography>
          </Box>
          <Box sx={{ mb: 1.5 }}>
            <InputLabel
              sx={{
                mb: 0.5,
                fontWeight: 500,
                mr: 1,
              }}
            >
              Username<span className="red">*</span>
            </InputLabel>
            <TextField
              disabled
              variant="outlined"
              size="small"
              sx={{ width: '100%' }}
              value={user?.name}
            />
          </Box>
          <Box sx={{ mb: 1.5 }}>
            <InputLabel
              sx={{
                mb: 0.5,
                fontWeight: 500,
              }}
            >
              Email<span className="red">*</span>
            </InputLabel>
            <TextField
              disabled
              variant="outlined"
              size="small"
              sx={{ width: '100%' }}
              value={authStore.user?.email}
            />
          </Box>
          <Box sx={{ mb: 1.5 }}>
            <InputLabel
              sx={{
                mb: 0.5,
                fontWeight: 500,
              }}
            >
              First Name<span className="red">*</span>
            </InputLabel>
            <TextField
              value={user?.firstName}
              variant="outlined"
              size="small"
              sx={{ width: '100%' }}
              onChange={(e: any) => {
                setUser({
                  ...user,
                  firstName: e.target.value,
                })
              }}
            />
          </Box>
          <Box sx={{ mb: 1.5 }}>
            <InputLabel
              sx={{
                mb: 0.5,
                fontWeight: 500,
              }}
            >
              Last Name<span className="red">*</span>
            </InputLabel>
            <TextField
              value={user?.lastName}
              variant="outlined"
              size="small"
              sx={{ width: '100%' }}
              onChange={(e: any) => {
                setUser({
                  ...user,
                  lastName: e.target.value,
                })
              }}
            />
          </Box>
          <Box
            sx={{ mb: 1.5, display: 'flex', justifyContent: 'space-between' }}
          >
            <Box sx={{ width: '40%' }}>
              <InputLabel
                sx={{
                  mb: 0.5,
                  fontWeight: 500,
                }}
              >
                Title<span className="red">*</span>
              </InputLabel>
              <Select
                sx={{ width: '100%' }}
                value={user.title}
                size="small"
                className="select"
                onChange={(e: any) => {
                  setUser({
                    ...user,
                    title: e.target.value,
                  })
                }}
              >
                {titles.map((title: string) => (
                  <MenuItem value={title}>{title}</MenuItem>
                ))}
              </Select>
            </Box>
            <Box sx={{ width: '59%' }}>
              <InputLabel
                sx={{
                  mb: 0.5,
                  fontWeight: 500,
                }}
              >
                Country
              </InputLabel>
              <TextField
                value={country}
                variant="outlined"
                size="small"
                sx={{ width: '100%' }}
                disabled
              />
            </Box>
          </Box>
          <Box sx={{ mb: 1.5 }}>
            <InputLabel
              sx={{
                mb: 0.5,
                fontWeight: 500,
              }}
            >
              Years of Monitoring Experience<span className="red">*</span>
            </InputLabel>
            <TextField
              value={user?.monitoring}
              variant="outlined"
              size="small"
              sx={{ width: '100%' }}
              type="number"
              onChange={(e: any) => {
                setUser({
                  ...user,
                  monitoring: e.target.value,
                })
              }}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <InputLabel
              sx={{
                mb: 0.5,
                fontWeight: 500,
              }}
            >
              Password
            </InputLabel>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {/* <TextField
                variant="outlined"
                size="small"
                sx={{ width: '100%', mr: 1 }}
                onChange={(e: any) => {
                  setPassword(e.target.value);
                }}
                value={password}
                type="password"
              /> */}
              <OutlinedInput
                sx={{ width: '100%' }}
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => {
                        setShowPassword(!showPassword)
                      }}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                size="small"
              />
              <Button
                onClick={changePassword}
                sx={{
                  minWidth: '20px',
                  width: '45px',
                  pr: 0,
                }}
              >
                <SaveIcon />
              </Button>
            </Box>
            <InputLabel
              sx={{
                fontWeight: 500,
                mb: 1,
                mt: 2,
              }}
            >
              Optional
            </InputLabel>
            {is2fa ? (
              <Button
                variant="contained"
                sx={{
                  boxShadow: 'none !important',
                  fontWeight: 600,
                  borderRadius: '5px !important',
                  bgcolor: 'rgb(209, 50, 18) !important',
                }}
                onClick={disableTwoFactorAuth}
              >
                Disable 2-Step Verification
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{
                  boxShadow: 'none !important',
                  fontWeight: 600,
                  borderRadius: '5px !important',
                  bgcolor: 'rgb(29, 129, 2) !important',
                }}
                onClick={generateQrCode}
              >
                Setup 2-Step Verification
              </Button>
            )}
          </Box>
          <Box
            sx={{
              textAlign: 'right',
              position: 'absolute',
              bottom: 0,
              right: 0,
              m: 2,
            }}
          >
            <Button
              variant="contained"
              sx={{
                mt: 3,
                fontWeight: 600,
              }}
              onClick={onClickSave}
            >
              Update Profile
            </Button>
          </Box>
        </Card>
      </Grid>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '30%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Card sx={{ px: 3, py: 3 }}>
          <Typography sx={{ pl: 2 }}>Password Rules</Typography>
          <ul
            style={{
              fontWeight: 600,
              marginLeft: '30px',
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
            }}
          >
            <li> At least 8 characters</li>
            <li>One uppercase letter</li>
            <li>One lowercase letter</li>
            <li>One number</li>
          </ul>
          <Typography sx={{}}>
            Your password <span className="red">does not meet the rules.</span>
          </Typography>
        </Card>
      </Box>
    </Box>
  )
}

export default observer(ProfileView)
