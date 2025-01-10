import { observer } from 'mobx-react'
import { Button } from 'src/ui/core/components'
import { Avatar, Box } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'

function ProfileCardView({ userEmail, userPassword, headerHandler }: any) {
  const { onClickSignin, onClickSignup } = headerHandler
  return (
    <>
      {userEmail && userPassword ? (
        <>
          <Avatar sx={{ width: '25px', height: '25px' }}></Avatar>
          <Box sx={{ paddingLeft: 1 }}>{userEmail}</Box>
          <Button color="inherit" sx={{ justifyContent: 'flex-end', width: 100, padding: 'none' }}>
            SIGN-OUT
          </Button>
          <LogoutIcon></LogoutIcon>
        </>
      ) : (
        <>
          <Button color="inherit" onClick={onClickSignin} sx={{ width: 200 }}>
            Login
          </Button>
          <Button color="inherit" onClick={onClickSignup} sx={{ width: 200 }}>
            SignUp
          </Button>
        </>
      )}
    </>
  )
}
export default observer(ProfileCardView)