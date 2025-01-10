import { useState } from 'react'
// @mui
import { alpha } from '@mui/material/styles'
import {
  Avatar,
  Typography,
  ListItemText,
  ListItemAvatar,
  MenuItem,
  Stack,
} from '@mui/material'
// utils
// import { fToNow } from '../../../utils/formatTime';
// _mock_
// import { _contacts } from '../../../_mock';
// components
import Iconify from '../../../components/Iconify'
import Scrollbar from '../../../components/Scrollbar'
import MenuPopover from '../../../components/MenuPopover'
import BadgeStatus from '../../../components/BadgeStatus'
import { IconButtonAnimate } from '../../../components/animate'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import LanguageIcon from '@mui/icons-material/Language'

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 64

// ----------------------------------------------------------------------

export default function ContactsPopover() {
  // const _contacts = []
  const [open, setOpen] = useState<HTMLElement | null>(null)

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget)
  }

  const handleClose = () => {
    setOpen(null)
  }

  return (
    <>
      <IconButtonAnimate
        color={open ? 'primary' : 'default'}
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          ...(open && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.focusOpacity
              ),
          }),
        }}
      >
        {/* <Iconify
          icon={'eva:people-fill'}
          width={20}
          height={20}
          color="white"
        /> */}
        <LanguageIcon
          sx={{
            color: 'white',
          }}
        />
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          width: '150px',
          left: '1450px',
          // ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Stack sx={{ p: 1 }}>
          <MenuItem
            onClick={() => {
              if (process.env.NODE_ENV === 'production') {
                window.location.replace(
                  'https://craa-app-dev-3.hoansoft.com/home'
                )
              } else {
                window.location.replace('http://localhost:3000/home')
              }
            }}
          >
            User
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (process.env.NODE_ENV === 'production') {
                window.location.replace('https://craa-client-dev-3.hoansoft.com')
              } else {
                window.location.replace('http://localhost:3002')
              }
            }}
          >
            Client
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (process.env.NODE_ENV === 'production') {
                window.location.replace(
                  'https://craa-training-dev-3.hoansoft.com/training-admin/console/assets/trainings/all'
                )
              } else {
                window.location.replace(
                  'http://localhost:8084/training-admin/console/assets/trainings/all'
                )
              }
            }}
          >
            Training
          </MenuItem>
        </Stack>
      </MenuPopover>
    </>
  )
}
