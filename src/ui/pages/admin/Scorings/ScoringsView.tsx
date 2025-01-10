import {
  AssessmentStatus,
  ScorerStatus,
  SimulationType,
  UserSimulationStatus,
} from 'src/utils/status'
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'

import Assessment from 'src/models/assessment'
import { IAssessment } from 'src/models/assessment/assessment.interface'
import ISimulation from 'src/models/simulation/simulation.interface'
import IUser from 'src/models/user/user.interface'
import { PATH_ADMIN } from 'src/routes/paths'
import User from 'src/models/user'
import UserSimulation from 'src/models/userSimulation'
import { Utils } from '@utils'
import _ from 'lodash'
import { observer } from 'mobx-react'
import { red } from '@mui/material/colors'
import { styled } from 'src/experiments/styles/stitches.config'
import uniqid from 'uniqid'
import { useNavigate } from 'react-router-dom'
import { useRootStore } from 'src/stores'
import { useUser } from '@hooks'

const sections = [
  'Expedited',
  'All done & ready to score(followup not existed)',
  'Simulations ready to score',
  'Simulation Done',
]

function ScoringsView(props: {
  assessments: IAssessment[]
  assessment: IAssessment
}) {
  const _assessments = props.assessments

  return (
    <Box sx={{ height: 'calc(100vh - 100px)', overflow: 'auto' }}>
      {sections?.map((section) => (
        <ScoringCard
          key={uniqid()}
          section={section}
          assessments={_assessments}
        />
      ))}
    </Box>
  )
}

const ScoringCard = observer(
  ({
    section,
    assessments,
  }: {
    section: string
    assessments: IAssessment[]
  }) => {
    const { data } = useUser()
    const renderAssessment = (assessment: IAssessment) => {
      return <AssessmentRow key={uniqid()} assessment={assessment} />
    }
    const bySection = (section: string, assessment: IAssessment) => {
      const scorerType = (): 'firstScorer' | 'secondScorer' | null => {
        switch (data._id) {
          case assessment.firstScorer._id: {
            return 'firstScorer'
          }
          case assessment.secondScorer._id: {
            return 'secondScorer'
          }
        }
        return null
      }
      const _scorerType = scorerType()
      if (!_scorerType) return false
      switch (section) {
        case sections[0]: {
          return (
            assessment[_scorerType]?.status !== ScorerStatus.Complete &&
            assessment.isExpedited
          )
        }
        case sections[1]: {
          const isCompleted =
            assessment[_scorerType]?.status === ScorerStatus.Complete
          const isFollowup =
            ((assessment as any).userSimulation as UserSimulation)
              .simulationType === SimulationType.Followup
          const isRelatedAssessmentsReady = (
            (assessment as any).relatedSimulations as UserSimulation[]
          ).reduce((acc, _userSimulation) => {
            const relatedAssessments = (assessment as any)
              .relatedAssessments as Assessment[]
            if (_userSimulation.status === UserSimulationStatus.HasNotAssigned)
              return acc
            if (
              relatedAssessments.find(
                (_ra) => _ra.userSimulationId === _userSimulation._id
              )
            ) {
              return acc && true
            }
            return false
          }, true)
          return !isCompleted && isFollowup && isRelatedAssessmentsReady
        }
        case sections[2]: {
          const isCompleted =
            assessment[_scorerType]?.status === ScorerStatus.Complete
          const isFollowup =
            ((assessment as any).userSimulation as UserSimulation)
              .simulationType === SimulationType.Followup
          const isRelatedAssessmentsReady = (
            (assessment as any).relatedSimulations as UserSimulation[]
          ).reduce((acc, _userSimulation) => {
            const relatedAssessments = (assessment as any)
              .relatedAssessments as Assessment[]
            if (_userSimulation.status === UserSimulationStatus.HasNotAssigned)
              return acc
            if (
              relatedAssessments.find(
                (_ra) => _ra.userSimulationId === _userSimulation._id
              )
            ) {
              return acc && true
            }
            return false
          }, true)
          return (
            !(isFollowup && isRelatedAssessmentsReady) &&
            !assessment.isExpedited &&
            assessment[_scorerType]?.status !== ScorerStatus.Complete
          )
        }
        case sections[3]: {
          return assessment[_scorerType]?.status === ScorerStatus.Complete
        }
        default:
          break
      }
    }
    return (
      <Card sx={{ mt: 2, p: 0 }} className="paper-grid">
        <CardHeader title={section} />
        <CardContent>
          <Table>
            <TableHead>
              <Header />
            </TableHead>
            <TableBody>
              {assessments
                ?.filter((assessment) => bySection(section, assessment))
                ?.map(renderAssessment)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }
)

const Header = observer(() => {
  return (
    <TableRow>
      <TableCell sx={{ py: '8px !important', lineHeight: '1.5 !important' }}>
        Date Remaining
      </TableCell>
      <TableCell>Initial</TableCell>
      <TableCell>Simulation</TableCell>
      <TableCell>Actions</TableCell>
    </TableRow>
  )
})

const AssessmentRow = observer(
  ({ assessment }: { assessment: IAssessment }) => {
    const { authStore } = useRootStore()

    const navigate = useNavigate()
    const assessmentUser = (assessment as any).userSimulation.user as IUser
    const assessmentSimulation = (assessment as any).userSimulation
      .simulation as ISimulation

    const onClick = (disabled?: boolean) => {
      navigate(
        `${PATH_ADMIN.scorings.score}/userSimulations/${assessment.userSimulationId}`,
        {
          state: {
            disabled,
          },
        }
      )
    }

    let scorer: {
      _id: string
      status: ScorerStatus
    } = {
      _id: '',
      status: ScorerStatus.HasNotStarted,
    }

    if (authStore.isLoading || !authStore.user) return null

    const isFirstScorer = authStore.user._id === assessment.firstScorer._id
    const isSecondScorer = authStore.user._id === assessment.secondScorer._id

    if (isFirstScorer) {
      scorer._id = authStore.user._id
      scorer.status = assessment.firstScorer.status
    } else if (isSecondScorer) {
      scorer._id = authStore.user._id
      scorer.status = assessment.secondScorer.status
    } else {
      return null
    }

    const buttonContent = () => {
      switch (scorer.status) {
        case ScorerStatus.HasNotStarted: {
          return 'start'
        }
        case ScorerStatus.InProgress: {
          return 'continue'
        }
        case ScorerStatus.Complete: {
          return 'complete'
        }
        case ScorerStatus.Pending: {
          return 'start'
        }
        default: {
          return scorer.status
        }
      }
    }

    const getRemainingDay = () => {
      const startDate = new Date(assessment.createdAt) as Date
      const deadline = (assessment as any).userSimulation.deadline as number
      // const dueDate = new Date(
      //   new Date().setDate(startDate.getDate() + deadline)
      // )
      const dueDate = new Date(startDate.getTime());
      dueDate.setDate(dueDate.getDate() + deadline);

      // const difference = new Date(dueDate.getDate() - startDate.getDate())
      const differenceInTime = dueDate.getTime() - startDate.getTime();
      const differenceInDays = differenceInTime / (1000 * 3600 * 24);      
      // return difference.getUTCDate() - 1
      return Math.ceil(differenceInDays);
    }

    return (
      <TableRow>
        <TableCell
          sx={{
            pl: '0 !important',
            py: '8px !important',
            lineHeight: '1.5 !important',
          }}
        >
          {getRemainingDay()}
        </TableCell>
        <TableCell sx={{ pl: '0 !important' }}>
          {assessmentUser?.profile?.initial}
        </TableCell>        
        <TableCell sx={{ pl: '0 !important' }}>
          {assessmentSimulation?.name || ''}
          {/* {assessment.simulation.name} */}
        </TableCell>

        <TableCell sx={{ pl: '0 !important' }}>
          <ButtonGroup sx={{ mr: 3 }}>
            <Button
              disabled={scorer.status === ScorerStatus.Complete ? true : false}
              variant="contained"
              onClick={() => onClick(false)}
              sx={{
                width: 96,
                bgcolor: 'rgb(29, 129, 2) !important',
                borderColor: 'rgb(29, 129, 2) !important',
                fontSize: '13px !important',
                pt: 0,
                pb: 0,
                height: '25px !important',
              }}
            >
              {buttonContent()}
            </Button>
            <Button
              variant="outlined"
              sx={{
                width: 96,
                color: 'rgb(0, 115, 187) !important',
                borderColor: 'rgb(0, 115, 187) !important',
                pt: 0,
                pb: 0,
                height: '25px !important',
                fontSize: '13px !important',
              }}
              onClick={() => onClick(true)}
            >
              {scorer.status === ScorerStatus.Complete ? 'Review' : 'Preview'}
            </Button>

            <Button
              variant="outlined"
              sx={{
                width: 96,
                color: 'rgb(236, 114, 17) !important',
                borderColor: 'rgb(236, 114, 17) !important',
                pt: 0,
                pb: 0,
                height: '25px !important',
                fontSize: '13px !important',
              }}
            >
              Roadmap
            </Button>
          </ButtonGroup>
          {assessment.isExpedited && <Expedited>Expedited</Expedited>}
        </TableCell>
      </TableRow>
    )
  }
)

const Expedited = styled('div', {
  height: 32,
  width: 100,
  background: red[600],
  borderRadius: 30,
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'white',
  fontWeight: 700,
})

export default observer(ScoringsView)
