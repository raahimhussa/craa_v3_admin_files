import { memo } from 'react'
// @mui
import { styled } from '@mui/material/styles'
import { Container, AppBar } from '@mui/material'
// config
// components
import { NavSectionHorizontal } from '../../../components/nav-section'
//
import navConfig from './NavConfig'
import { HEADER } from 'src/config'

// ----------------------------------------------------------------------

// const RootStyle = styled(AppBar)(({ theme }) => ({
//   transition: theme.transitions.create('top', {
//     easing: theme.transitions.easing.easeInOut,
//     duration: theme.transitions.duration.shorter,
//   }),
//   width: '100%',
//   position: 'fixed',
//   zIndex: theme.zIndex.appBar,
//   padding: theme.spacing(1, 0),
//   boxShadow: theme.customShadows.z8,
//   top: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
//   backgroundColor: theme.palette.background.default,
// }));

// // ----------------------------------------------------------------------
const RootStyle = styled(AppBar)(({ theme }) => ({
  transition: theme.transitions.create('top', {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  width: '70%',
  position: 'fixed',
  zIndex: theme.zIndex.appBar + 2,
  padding: theme.spacing(1, 0),
  boxShadow: theme.customShadows.z8,
  top: 0,
  left: 0,
  right: 0,
  margin: '0 auto',
  // top: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
  backgroundColor: theme.palette.background.default,
  WebkitBoxShadow: 'none',
  backgroundImage: 'none !important',
}))
function NavbarHorizontal() {
  return (
    <RootStyle>
      <Container maxWidth={false} sx={{ py: '5px' }}>
        <NavSectionHorizontal navConfig={navConfig} />
      </Container>
    </RootStyle>
  )
}

export default memo(NavbarHorizontal)
