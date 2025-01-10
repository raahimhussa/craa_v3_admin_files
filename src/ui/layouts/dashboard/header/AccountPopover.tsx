import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
// @mui
import { alpha } from '@mui/material/styles'
import { Box, Divider, Typography, Stack, MenuItem } from '@mui/material'
// routes
// hooks
// components
import MyAvatar from '../../../components/MyAvatar'
import MenuPopover from '../../../components/MenuPopover'
import { IconButtonAnimate } from '../../../components/animate'
import { PATH_AUTH, PATH_ADMIN } from 'src/routes/paths'
import { useRootStore } from 'src/stores'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    linkTo: '/',
  },
  {
    label: 'Profile',
    linkTo: PATH_ADMIN.users.profile,
  },
  {
    label: 'Settings',
    linkTo: PATH_ADMIN.users,
  },
]

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const navigate = useNavigate()
  const {
    authStore: { user },
    authStore,
  } = useRootStore()
  // const { user, logout } = useAuth();

  // const isMountedRef = useIsMountedRef();

  // const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState<HTMLElement | null>(null)

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget)
  }

  const handleClose = () => {
    setOpen(null)
  }

  const handleLogout = async () => {
    try {
      // await logout();
      // navigate(PATH_AUTH.login, { replace: true });
      // if (isMountedRef.current) {
      //   handleClose();
      // }
    } catch (error) {
      console.error(error)
      // enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  }

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) =>
                alpha(
                  theme.palette.primary.main,
                  theme.palette.action.focusOpacity
                ),
            },
          }),
          m: 1,
        }}
      >
        <AccountCircleIcon
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
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem
              key={option.label}
              //@ts-ignore
              to={option.linkTo}
              component={RouterLink}
              onClick={handleClose}
            >
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={async () => {
            await authStore.logout()
            // navigate('/auth/signin')
            const mode = import.meta.env.MODE
            if (mode === 'production') {
              window.location.replace(
                'https://craa-app-dev-3.hoansoft.com/auth/signin'
              )
            } else {
              window.location.replace('http://localhost:3000/auth/signin')
            }
          }}
          sx={{ m: 1 }}
        >
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  )
}
