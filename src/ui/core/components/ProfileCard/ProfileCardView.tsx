import { observer } from 'mobx-react'
import { Avatar, Box, Button, Typography } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { useRootStore } from 'src/stores'

function ProfileCardView({ button = null, isLogoutButtonVisible = true }: any) {
  const { authStore, routerStore } = useRootStore()
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flex: 1,
      }}
    >
      {authStore.user?._id ? (
        <>
          <Avatar sx={{ width: '25px', height: '25px', mr: 1 }} />
          <Typography sx={{ mr: 2 }} variant="button" color={'white'}>
            {authStore.user?.name}
          </Typography>
          {isLogoutButtonVisible && (
            <Button
              endIcon={<LogoutIcon htmlColor="white" />}
              fullWidth={false}
              onClick={() => authStore.logout()}
              sx={{ color: 'white' }}
            >
              SIGN-OUT
            </Button>
          )}
          {button}
        </>
      ) : (
        <>
          <Button
            sx={{
              color: 'white',
              fontWeight: 500,
            }}
            onClick={() => routerStore.go('auth:signin')}
          >
            Login
          </Button>
        </>
      )}
    </Box>
  )
}
export default observer(ProfileCardView)
