import {
  Button,
  Grid,
  Link,
  TextField,
  Typography,
} from 'src/ui/core/components'

import { Box } from '@mui/material'
import { observer } from 'mobx-react'
import { useNavigate } from 'react-router-dom'
import { useRootStore } from 'src/stores'

function SigninView() {
  const { authStore } = useRootStore()
  const nav = useNavigate()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* <Typography variant="h5">Sign-in</Typography> */}
      <TextField
        state={authStore.signInUser}
        path="usernameOrEmail"
        name="username"
        label="Username or Email"
        variant="outlined"
        type="text"
        required
        sx={{ mt: 2 }}
      />
      <TextField
        state={authStore.signInUser}
        path="password"
        name="password"
        label="Password"
        variant="outlined"
        type="password"
        required
        sx={{ mt: 2 }}
      />
      <Button
        onClick={async () => {
          await authStore.signin()

          if (!authStore.loggingIn) {
            nav('/admin/users/userManagement')
          }
        }}
        fullWidth
        type="submit"
        variant="contained"
        sx={{ mt: 2, mb: 3, py: 2.3, fontSize: '13px' }}
      >
        SIGN-IN
      </Button>
      {/* <Grid container spacing={2}>
        <Grid item xs={12}>
          <Link>Forgot username?</Link>
        </Grid>
        <Grid item xs={12}>
          <Link>Forgot password?</Link>
        </Grid>
      </Grid> */}
    </Box>
  )
}

export default observer(SigninView)
