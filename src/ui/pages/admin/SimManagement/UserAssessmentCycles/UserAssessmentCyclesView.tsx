import UserAssessmentCycles from 'src/ui/core/components/tables/UserAssessmentCycles/UserAssessmentCycles'
import _ from 'lodash'
import { observer } from 'mobx-react'
import { AssessmentCycle } from 'src/models/assessmentCycle'
import UserAssessmentCycle from 'src/models/userAssessmentCycle'
// @ts-ignore
function UserAssessmentCyclesView(props) {
  const {
    userAssessmentCycles,
    assessmentCycles,
  }: {
    userAssessmentCycles: UserAssessmentCycle[]
    assessmentCycles: AssessmentCycle[]
  } = props

  const _userAssessmentCycles = _.cloneDeep(userAssessmentCycles)
  _userAssessmentCycles?.forEach((uac) => {
    uac.assessmentCycle = assessmentCycles.find((ac) => {
      return ac._id === uac.assessmentCycleId
    })
  })

  return (
    <UserAssessmentCycles
      {...props}
      userAssessmentCycles={_userAssessmentCycles}
    />
  )
}
export default observer(UserAssessmentCyclesView)
