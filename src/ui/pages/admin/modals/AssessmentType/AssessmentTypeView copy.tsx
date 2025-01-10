import { observer } from 'mobx-react'
import { Autocomplete, Select, TextField } from 'src/ui/core/components'
import DetailLayout from 'src/ui/layouts/DetailLayout/DetailLayout'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import { green, teal } from '@mui/material/colors'
import { toJS } from 'mobx'
import uniqid from 'uniqid'
import _ from 'lodash'
import TimeLimitSelect from 'src/ui/core/components/TimeLimitSelect/TimeLimitSelect'
import { useRootStore } from 'src/stores'
import { DocKind } from 'src/models/doc/doc.interface'

function AssessmentTypeView(props: any) {
  const { state, simulations, trainings, domains, docs } = props
  const {
    assessmentTypeStore,
    uiState: { assessmentTypes, windowDimensions },
  } = useRootStore()
  const domainOptions = domains?.map((domain: any) => {
    return {
      text: domain.name,
      value: domain._id,
    }
  })
  const simulationOptions = simulations?.map((simulation: any) => ({
    value: simulation._id,
    text: simulation.label,
  }))
  const trainingOptions = trainings?.map((training: any) => ({
    text: training.label,
    value: training._id,
  }))

  const protocolOptions = docs
    .filter((doc: any) => doc.kind === DocKind.Protocol)
    .map((protocol: any) => ({
      text: protocol.title,
      value: protocol._id,
    }))

  const instructionOptions = docs
    .filter((doc: any) => doc.kind === DocKind.Instruction)
    .map((instruction: any) => ({
      text: instruction.title,
      value: instruction._id,
    }))
  const studyDocumentOptions = docs
    .filter((doc: any) => doc.kind === DocKind.StudyDocument)
    .map((studyDocument: any) => ({
      text: studyDocument.title,
      value: studyDocument._id,
    }))

  const onClickAdd = () => {
    const selectedDomain = domains?.find(
      (domain: any) => domain._id === state.form.domainId
    )
    state.form.followup.domain._id = state.form.domainId
    state.form.training.domain._id = state.form.domainId
    state.form.followup.domain.label = selectedDomain?.name || 'Domain'
    state.form.training.domain.label = selectedDomain?.name || 'Domain'
    assessmentTypeStore.form.followups.push(toJS(state.form.followup))
    assessmentTypeStore.form.trainings.push(toJS(state.form.training))
  }

  const onClickDelete =
    (type: 'followups' | 'trainings', index: number) => () => {
      assessmentTypeStore.form[type].splice(index, 1)
    }

  return (
    <DetailLayout store={assessmentTypeStore} mutate={assessmentTypes.mutate}>
      <Grid
        container
        spacing={2}
        sx={{
          p: 2,
          bgcolor: 'white',
          height: windowDimensions.height - 100,
          overflow: 'scroll',
        }}
      >
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Common Information"
              sx={{ bgcolor: teal[300], color: 'white' }}
            />
            <CardContent>
              <Stack spacing={2}>
                <TextField
                  label="Label"
                  state={assessmentTypeStore}
                  path="form.label"
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        {/* <Grid item xs={12} display="flex" justifyContent={'flex-end'} flexDirection="column">
          <Stack spacing={1}>
            <Button
              disabled={!state.form.domainId}
              onClick={onClickAdd}
              variant="contained"
              sx={{ bgcolor: green[500] }}
            >
              {!state.form.domainId ? 'Select Domain' : 'New Training/Followup'}
              New Training/Followup
            </Button>
            <Select
              fullWidth
              options={domainOptions}
              state={state}
              path="form.domainId"
              label="Domain"
            />
          </Stack>
        </Grid> */}
        <Grid item xs={4}>
          <Card>
            <CardHeader
              title={'Baseline'}
              sx={{ bgcolor: teal[300], color: 'white' }}
            />
            <CardContent>
              <Stack spacing={2}>
                <TextField
                  state={assessmentTypeStore}
                  path="form.baseline.label"
                  label="Label"
                />

                <TimeLimitSelect
                  label="test time"
                  state={assessmentTypeStore}
                  path="form.baseline.testTime"
                />

                <TextField
                  label="Attempt Count"
                  number
                  type={'number'}
                  state={assessmentTypeStore}
                  path="form.baseline.attemptCount"
                />

                <Select
                  label="Simulation"
                  state={assessmentTypeStore}
                  options={simulationOptions}
                  path="form.baseline.simulationId"
                />

                <Autocomplete
                  label="StudyLogs"
                  state={assessmentTypeStore}
                  options={studyDocumentOptions}
                  path="form.baseline.studyLogIds"
                />

                <Autocomplete
                  label="Instruction"
                  state={assessmentTypeStore}
                  options={instructionOptions}
                  path="form.baseline.instructionIds"
                />

                <Autocomplete
                  label="Protocol"
                  state={assessmentTypeStore}
                  options={studyDocumentOptions}
                  path="form.baseline.protocolIds"
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardHeader
              title={`Trainings/Followup`}
              sx={{ bgcolor: teal[300], color: 'white' }}
            />
            {assessmentTypeStore.form.trainings?.map(
              (training: any, index: number) => {
                domains.map
                return (
                  <>
                    <CardContent key={uniqid()}>
                      <Stack spacing={3}>
                        <TextField state={training} path="label" />

                        <Typography sx={{ fontWeight: 600 }}>Domain</Typography>
                        <Typography>{training.domain.label}</Typography>

                        {/* <TimeLimitSelect label="test time" state={training} path="testTime" /> */}

                        <Select
                          label="Training"
                          options={trainingOptions}
                          state={training}
                          path="_id"
                        />

                        {/* <Autocomplete
                        label="Instruction"
                        state={training}
                        options={instructionOptions}
                        path="intructionIds"
                      />

                      <Autocomplete
                        label="Protocol"
                        state={training}
                        options={protocolOptions}
                        path="protocolIds"
                      /> */}
                      </Stack>
                    </CardContent>
                    <CardActions>
                      <Button
                        onClick={onClickDelete('trainings', index)}
                        size="small"
                        color="error"
                      >
                        Delete
                      </Button>
                    </CardActions>
                    <Divider />
                  </>
                )
              }
            )}
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardHeader
              title={'Followups'}
              sx={{ bgcolor: teal[300], color: 'white' }}
            />
            {assessmentTypeStore.form.followups.map(
              (followup: any, index: number) => {
                return (
                  <>
                    <CardContent key={uniqid()}>
                      <Stack spacing={3}>
                        <TextField state={followup} path="label" />
                        <Typography sx={{ fontWeight: 600 }}>Domain</Typography>
                        <Typography>{followup.domain.label}</Typography>

                        <TimeLimitSelect
                          label="test time"
                          state={followup}
                          path="testTime"
                        />

                        <Select
                          label="Simulation"
                          options={simulationOptions}
                          state={followup}
                          path="simulationId"
                        />

                        <TextField
                          label="Attempt Count"
                          number
                          type={'number'}
                          state={followup}
                          path="attemptCount"
                        />
                      </Stack>
                    </CardContent>
                    <CardActions>
                      <Button
                        onClick={onClickDelete('followups', index)}
                        size="small"
                        color="error"
                      >
                        Delete
                      </Button>
                    </CardActions>
                    <Divider />
                  </>
                )
              }
            )}
          </Card>
        </Grid>
      </Grid>
    </DetailLayout>
  )
}
export default observer(AssessmentTypeView)
