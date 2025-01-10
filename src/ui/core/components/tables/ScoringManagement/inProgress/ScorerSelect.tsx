import {
  AnswerStatus,
  AssessmentStatus,
  ScorerStatus,
  SimulationType,
  UserSimulationStatus,
} from 'src/utils/status'
import { observer, useLocalObservable } from 'mobx-react'
import { reaction, toJS } from 'mobx'

import { AssessmentScorerType } from 'src/stores/ui/pages/assessment'
import { IAssessment } from 'src/models/assessment/assessment.interface'
import IRole from 'src/models/role/role.interface'
import IUser from 'src/models/user/user.interface'
import Select from 'src/ui/core/components/mui/inputs/Select/Select'
import UserSimulation from 'src/models/userSimulation'
import { Utils } from '@utils'
import axios from 'axios'
import compose from '@shopify/react-compose'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'
import { withFind } from '@hocs'

const ScorerSelectView = ({
  row,
  users,
  roles,
  path,
  mutate,
  userSimulation,
}: {
  row: any
  users: IUser[]
  roles: IRole[]
  path: string
  mutate: any
  userSimulation: UserSimulation
}) => {
  const { assessmentStore, answerStore } = useRootStore()

  const localState = useLocalObservable(() => ({
    assessment: row.original,
  }))
  const { enqueueSnackbar } = useSnackbar()

  const values = path.split('.')
  reaction(
    () => {
      return localState.assessment[values[0]][values[1]]
    },
    async (value) => {
      const assessment = toJS(localState.assessment) as IAssessment
      let allowedToChange = true;
      // console.log(assessment, AssessmentScorerType)
      Object.values(AssessmentScorerType).forEach((_scorerType) => {        
        if (_scorerType === values[0]) return;
        if (_scorerType !== 'adjudicator' && assessment[_scorerType]?._id === value) {
          allowedToChange = false;
        }        
      })
      if (!allowedToChange) {
        return enqueueSnackbar('Duplicated scorer', { variant: 'error' })
      }
      try {
        await assessmentStore.repository.update({
          filter: { _id: localState.assessment._id },
          update: { [path]: value },
        })
        await answerStore.repository.update({
          filter: {
            assessmentId: localState.assessment._id,
          },
          update: {
            $set: {
              [`scoring.${values[0]}.scorerId`]: value,
              [`scoring.${values[0]}.noteId`]: null,
              [`scoring.${values[0]}.answerStatus`]: AnswerStatus.NotScored,
              [`scoring.${values[0]}.updatedAt`]: new Date(),
            },
          },
        })
        if (userSimulation.simulationType === SimulationType.Baseline) {
          await axios.patch(`/v1/userAssessmentCycles/renewSummary`, {
            filter: {
              userBaselineId: userSimulation._id,
            },
          })
        } else {
          await axios.patch(`/v1/userAssessmentCycles/renewSummary`, {
            filter: {
              userFollowupIds: userSimulation._id,
            },
          })
        }
        mutate && mutate()
        enqueueSnackbar('Changed Successfully', { variant: 'success' })
      } catch (error) {
        Utils.errorLog(error)
        enqueueSnackbar('Fail to change', { variant: 'error' })
      }
    }
  )

  const isPublished =
    row.original?.userSimulation.status === UserSimulationStatus.Published

  const isDistributed =
    row.original?.userSimulation.status === UserSimulationStatus.Distributed
  // localState.assessment.status === AssessmentStatus.Published
  const userOptions = users
    // ?.filter((user) => {
    //   const role = roles.find((role) => role._id === user.roleId)
    //   return role?.priority !== 0
    // })
    .sort((a, b) => 
      (a.profile?.firstName?.toUpperCase() || "")
      .localeCompare(b.profile?.firstName?.toUpperCase() || ""))   
    .map((user) => {
      // const role = roles.find((role) => role._id === user.roleId)

      return {
        // text: user.name + '-' + role?.title,
        // text:`${user.profile?.firstName} ${user.profile?.lastName}`,
        text:`${user.profile?.firstName}`,
        value: user._id,
      }
    })

  const getDisabled = () => {
    if (localState.assessment[values[0]].status === ScorerStatus.Complete) {
      return true
    }
    return false
  }
  return (
    <Select
      className="table-select"
      disabled={getDisabled() || isPublished || isDistributed}
      options={userOptions}
      state={localState.assessment}
      path={path}
      sx={{ width: '165px', height: '30px' }}
    />
  )
}

// const getRolesFilter = () => ({})

// const getUsersFilter = (props: { roles: IRole[] }) => {
//   const scorerRoles = ['SimScorer', 'ClientAdmin', 'Admin', 'SuperAdmin']
//   return {
//     roleId: {
//       $in: props.roles
//         .filter((role) => scorerRoles.includes(role.title))
//         .map((role) => role._id),
//     },
//   }
// }

export default compose<any>(
  // withFind({
  //   collectionName: 'roles',
  //   getFilter: getRolesFilter,
  // }),
  // withFind({
  //   collectionName: 'users',
  //   getFilter: getUsersFilter,
  // })
)(observer(ScorerSelectView))
