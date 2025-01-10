import { AnswerStatus } from 'src/utils/status'
import IAnswer from 'src/models/answer/answer.interface'
import { IAssessment } from 'src/models/assessment/assessment.interface'
import IUser from 'src/models/user/user.interface'
import SimCardView from './SimCardView'
import UiState from 'src/stores/ui'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
import withFindOne from 'src/hocs/withFindOne'
import withProps from './withProps'
import withUiStore from 'src/hocs/withUiStore'

type AssessmentsFilterProps = {
  modal: UiState['modal']
  userId: string
}

type UserSimulationsFilterProps = {
  assessments: IAssessment[]
}

const getAssessmentsFilter = (props: AssessmentsFilterProps) => {
  const { modal, userId } = props
  // const user: IUser = modal.payload.user

  return {
    'user._id': userId,
  }
}

const getAnswersFilter = (props: UserSimulationsFilterProps) => {
  const { assessments } = props
  const assessmentIds = assessments?.map((a) => a._id)
  return {
    assessmentId: {
      $in: assessmentIds,
    },
  }
}

const getUserSimulationsFilter = (props: UserSimulationsFilterProps) => {
  const { assessments } = props
  const assessmentIds = assessments?.map((a) => a._id)
  return {
    assessmentId: {
      $in: assessmentIds,
    },
  }
}

type FindingsFilterProps = {
  answers: IAnswer[]
}

const getFindingsFilter = (props: FindingsFilterProps) => {
  const { answers } = props

  return {
    _id: {
      $in: answers.map((answer) => answer.findingId),
    },
  }
}

const getUserSimulationFilter = ({
  assessments,
}: {
  assessments: IAssessment[]
}) => {
  return {
    _id: {
      // @ts-ignore
      $in: assessments.map(
        (assessment) => assessment?.userAssessmentCycle?.userSimulationId
      ),
    },
  }
}

export default compose<any>(
  withUiStore('modal'),
  withFind({
    collectionName: 'assessments',
    getFilter: getAssessmentsFilter,
    version: 2,
  }),
  withFindOne({
    collectionName: 'users',
    // getFilter: (props: any) => ({
    //   _id: props.userId,
    // }),
    getFilter: getAssessmentsFilter,
  }),
  withFind({
    collectionName: 'answers',
    getFilter: getAnswersFilter,
    version: 2,
  }),
  withFind({
    collectionName: 'findings',
    getFilter: getFindingsFilter,
    version: 2,
  }),
  withFind({
    collectionName: 'userSimulations',
    getFilter: getUserSimulationFilter,
    version: 2,
  }),
  withFind({
    collectionName: 'domains',
    getFilter: () => ({ depth: 0 }),
    version: 2,
  }),
  withProps
)(SimCardView)
