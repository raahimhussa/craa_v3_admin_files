import { Grid, Spacer } from 'src/ui/core/components'
import { Box } from '@mui/material'
import { observer } from 'mobx-react'
import { Outlet } from 'react-router-dom'
function AuthLayoutView({
  LeftComponent = null,
  RightComponent = null,
  BottomComponent = null,
}: any) {
  return (
    <Outlet />
  )
}
export default observer(AuthLayoutView)
