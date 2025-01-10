import { Menus } from 'src/ui/core/components'
import { Grid } from '@mui/material'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useRootStore } from 'src/stores'
import { observer } from 'mobx-react'
import AppBar from 'src/ui/core/components/surfaces/AppBar/AppBar'
import { useEffect } from 'react'
import { useUser } from '@hooks'

function AdminLayoutView({}: any) {
  const {
    uiState: { adminLayout },
    uiState,
  } = useRootStore()
  const isDrawerOpen = adminLayout.isDrawerOpen
  const { data: user, isValidating } = useUser()
  const nav = useNavigate()
  const location = useLocation()
  useEffect(() => {
    if (!isValidating) {
      if (!user) {
        // nav('/auth/signin')
        // window.location.replace('http://localhost:3001/auth/signin')
        const mode = import.meta.env.MODE
        if (mode === 'production') {
          window.location.replace(
            'https://craa-app-dev-3.hoansoft.com/auth/signin'
          )
        } else {
          window.location.replace('http://localhost:3000/auth/signin')
        }
      }
    }
  }, [location.pathname, user, isValidating])

  const height = uiState.windowDimensions.height

  return (
    <Grid container item xs={12}>
      <Grid item xs={12}>
        <AppBar />
      </Grid>
      <Grid
        item
        xs={isDrawerOpen ? 3 : 0}
        sx={{
          height,
          display: isDrawerOpen ? 'inline-block' : 'none',
        }}
      >
        {isDrawerOpen ? <Menus /> : null}
      </Grid>
      <Grid
        item
        xs={isDrawerOpen ? 9 : 12}
        sx={{
          height,
          overflow: 'scroll',
          pl: 2,
        }}
      >
        <Outlet />
      </Grid>
    </Grid>
  )
}

export default observer(AdminLayoutView)
