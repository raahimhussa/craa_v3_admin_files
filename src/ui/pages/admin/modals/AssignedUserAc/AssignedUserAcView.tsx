import { Autocomplete, Select } from 'src/ui/core/components'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Stack,
} from '@mui/material'
import { observer, useLocalObservable } from 'mobx-react'

import IAssessmentCycle from 'src/models/assessmentCycle/assessmentCycle.interface'
import IUser from 'src/models/user/user.interface'
import axios from 'axios'
import { toJS } from 'mobx'
function AssignedUserACView({
  user,
  assessmentCycles,
}: {
  user: IUser
  assessmentCycles: IAssessmentCycle[]
}) {
  const localState = useLocalObservable(() => ({
    assessmentCycleId: '',
    userId: user._id,
  }))

  const acOptions = assessmentCycles.map((ac) => ({
    text: ac.name,
    value: ac._id,
  }))

  const onClickAssign = async () => {
    await axios.post('v1/userAssessmentCycles/assigned', toJS(localState))
  }

  return (
    <Card>
      <CardHeader title={user.name} />
      <CardContent>
        <Select
          options={acOptions}
          state={localState}
          path="assessmentCycleId"
        />
      </CardContent>
      <CardActions>
        <Button fullWidth variant="contained" onClick={onClickAssign}>
          Assign
        </Button>
      </CardActions>
    </Card>
  )
}
export default observer(AssignedUserACView)
