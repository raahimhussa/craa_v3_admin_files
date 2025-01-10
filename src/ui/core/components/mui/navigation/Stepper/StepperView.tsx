import { Button, Spacer } from 'src/ui/core/components'
import { Box, StepLabel } from '@mui/material'
import Step from '@mui/material/Step'
import Stepper from '@mui/material/Stepper'
import { MobxUtil } from '@utils'
import { action, reaction } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react'
import { Key, ReactChild, ReactFragment, ReactPortal } from 'react'
import uniqid from 'uniqid'

function StepperView({
  disabled = false,
  state = {},
  path = '',
  steps = [],
  onPressDone = () => alert('done'),
  ...rest
}: any) {
  const localState = useLocalObservable(() => ({
    value: MobxUtil._get(state, path) || 0,
  }))

  reaction(
    () => localState.value,
    () => MobxUtil._set(state, path, localState.value)
  )

  reaction(
    () => MobxUtil._get(state, path),
    () => (localState.value = MobxUtil._get(state, path))
  )

  const onClickButton = action(() => {
    steps[localState.value]?.button.onClick()
  })

  return (
    <div>
      <Button
        loading={steps[localState.value]?.button.loading}
        disabled={steps[localState.value]?.button.disabled}
        onClick={onClickButton}
        variant="contained"
      >
        {steps[localState.value]?.button.label}
      </Button>
      <Box sx={{ width: '100%' }}>
        <Spacer spacing={5} />
        <Stepper activeStep={localState.value}>
          {steps?.map(
            (step: {
              label:
              | boolean
              | ReactChild
              | ReactFragment
              | ReactPortal
              | null
              | undefined
            }) => (
              <Step key={uniqid()}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            )
          )}
        </Stepper>
      </Box>
    </div>
  )
}
export default observer(StepperView)
