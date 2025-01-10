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
  Link,
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
import ArticleIcon from '@mui/icons-material/Article'

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 64

// ----------------------------------------------------------------------

export default function DocumentPopover() {
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
        <ArticleIcon
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
          width: '140px',
          left: '1450px',
          // ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Stack sx={{ p: 1 }}>
          <Link
            href="/admin/documentBuilder/variables"
            sx={{
              textDecoration: 'none !important',
              color: 'black !important',
            }}
          >
            <MenuItem>Variables</MenuItem>
          </Link>
          <Link
            href="/admin/documentBuilder/documents"
            sx={{
              textDecoration: 'none !important',
              color: 'black !important',
            }}
          >
            <MenuItem>Documents</MenuItem>
          </Link>
        </Stack>
      </MenuPopover>
    </>
  )
}
