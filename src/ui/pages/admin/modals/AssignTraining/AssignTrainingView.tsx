import { Button, Select, Spacer, Typography } from 'src/ui/core/components'
import { Alert, AlertTitle } from '@mui/material'
import Box from '@mui/material/Box'
import ButtonGroup from '@mui/material/ButtonGroup'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
function AssignTrainingView({ simulations, assessmentCycles, users, state, ...rest }: any) {
  const { modalStore } = useRootStore()
  const options = assessmentCycles?.map((assessmentCycle: any) => ({
    text: assessmentCycle.title,
    value: assessmentCycle._id,
  }))

  const userOptions = users.map((user: any) => ({
    text: user.username,
    value: user._id,
  }))

  const onClickCancel = action(() => {
    modalStore.assignTraining.isVisible = false
  })

  const onClickASSIGN = async () => {
    const params = {
      filter: { _id: state.userId },
      update: {
        $addToSet: {
          assessmentCycleIds: state.assessmentCycleId,
        },
      },
    }
    // await userRepository.update(params)
    modalStore.assignTraining.isVisible = false
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">AssignTraining</Typography>
      <Spacer spacing={1} />
      <Box sx={{ boxShadow: 2, border: 0.1, borderColor: 'ActiveBorder', p: 4 }}>
        <Alert>
          <AlertTitle>Select AssessmentCycle</AlertTitle>
        </Alert>
        <Select
          label="Select Simulation Cycle"
          options={options}
          state={state}
          path="assessmentCycleId"
        />
        <Spacer spacing={2} />
        <Alert>
          <AlertTitle>Select User</AlertTitle>
        </Alert>
        <Select
          label="Select User For Assignment"
          options={userOptions}
          state={state}
          path="userId"
        />
        <Spacer spacing={2} />
      </Box>
      <Spacer spacing={1} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <ButtonGroup>
          <Button variant="contained" onClick={onClickASSIGN}>
            Assign
          </Button>
          <Button color="error" variant="contained" onClick={onClickCancel}>
            Cancel
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  )
}
export default observer(AssignTrainingView)
