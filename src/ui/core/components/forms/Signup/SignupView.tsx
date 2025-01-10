import { Copyright, Spacer, Stepper } from 'src/ui/core/components'
import Box from '@mui/material/Box'
import { observer } from 'mobx-react'
function SignupView({ state, steps }: any) {
  return (
    <Box
      sx={{
        width: '100%',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      <Spacer spacing={5} />
      <Box style={{ flex: 1 }}>
        {steps[state.step].render()}
        <Spacer spacing={7} />
        <Stepper disabled={!state.isChecked} state={state} path="step" steps={steps} />
        <Spacer spacing={6} />
      </Box>
      <Box sx={{ mb: 6 }}>
        <Copyright logo={false} />
      </Box>
    </Box>
  )
}
export default observer(SignupView)
