import { Autocomplete, Grid, Spacer, TextField, Typography } from 'src/ui/core/components'
import Box from '@mui/material/Box'
import { observer } from 'mobx-react'
function RegistrationView({ state }: any) {
  return (
    <Box>
      <Typography variant="h3">Registeration</Typography>
      <Spacer spacing={4} />
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <TextField
            state={state.user}
            path="email"
            label="Email"
            helperText="Required"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            state={state.user}
            path="username"
            label="Username"
            helperText="Required"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            type="password"
            state={state.user}
            path="password"
            label="Password"
            helperText="Required"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            type="password"
            state={state.user}
            path="PasswordConfirm"
            label="PasswordConfirm"
            helperText="Required"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            state={state.user}
            path="profile.firstName"
            label="Last name"
            helperText="Required"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            state={state.user}
            path="profile.lastName"
            label="First name"
            helperText="Required"
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete label="Title" helperText="Required" />
        </Grid>
        <Grid item xs={6}>
          <Autocomplete label="Country" helperText="Required" />
        </Grid>
        <Grid item xs={6}>
          <Autocomplete label="Monitoring Experience" helperText="Required" />
        </Grid>
        {/* <Grid item xs={6}>
          <TextField label="Authorisation code" helperText="Required" />
        </Grid> */}
      </Grid>
    </Box>
  )
}
export default observer(RegistrationView)
