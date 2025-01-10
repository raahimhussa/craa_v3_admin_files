import {
  Box,
  Button,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import { observer, useLocalObservable } from 'mobx-react'

import Domain from 'src/models/domain'
import Simulation from 'src/models/simulation'
import Training from 'src/models/tranning'
import { TrainingStatus } from 'src/utils/status'
import UserSimulation from 'src/models/userSimulation'
import UserTraining from 'src/models/userTraining'
import moment from 'moment'

type SimulationsProps = {
  userTrainings: UserTraining[]
  userFollowups: UserSimulation[]
  simulations: Simulation[]
  domains: Domain[]
  trainings: any[]
}

export default observer((props: SimulationsProps) => {
  const { userTrainings, userFollowups, domains, simulations, trainings } =
    props
  // const usage = Utils.convert(userTrainings.usageTime, 'astr')
  const state = useLocalObservable(() => ({
    isOpen: false,
  }))

  const onClickViewResults = () => (state.isOpen = true)
  console.log(trainings)

  return (
    <Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className="usercard-head-cell">
              Training Module
            </TableCell>
            <TableCell className="usercard-head-cell">Progress</TableCell>
            <TableCell className="usercard-head-cell">Quiz Score</TableCell>
            <TableCell className="usercard-head-cell">Started</TableCell>
            <TableCell className="usercard-head-cell">Complete</TableCell>
            <TableCell className="usercard-head-cell">Time(Video)</TableCell>
            <TableCell className="usercard-head-cell">Expected Time</TableCell>
            <TableCell className="usercard-head-cell">
              Over/Under time
            </TableCell>
            <TableCell className="usercard-head-cell">Followup</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {userTrainings?.map((_userTraining) => {
            try {
              const _training = trainings.filter((training) => {
                return training._id === _userTraining.trainingId
              })[0]
              const domainName =
                domains.find(
                  (_domain) => _domain._id === _userTraining.domainId
                )?.name || 'untitled'
              const progresses = _userTraining.progresses
                ? _userTraining.progresses
                : {}
              const progress = `${
                Object.values(progresses).length === 0
                  ? 0
                  : (Object.values(progresses).filter(
                      (_progress) =>
                        _progress.status === TrainingStatus.Complete
                    ).length *
                      100) /
                    Object.values(progresses).length
              } %`
              const quizScore = Object.values(progresses).reduce((acc, cur) => {
                return acc + (cur.quizScore !== undefined ? cur.quizScore : 0)
              }, 0)
              const totalScore = Object.values(progresses).reduce(
                (acc, cur) => {
                  return (
                    acc + (cur.totalScore !== undefined ? cur.totalScore : 0)
                  )
                },
                0
              )
              const videoTime = Object.values(progresses).reduce((acc, cur) => {
                return acc + cur.videoWatchingTime
              }, 0)
              const expectedTime: any = Object.values(_training?.pages).reduce(
                (acc, cur: any) => {
                  return acc + cur.duration
                },
                0
              )
              const userFollowup = userFollowups.find(
                (_userFollowup) =>
                  _userFollowup.domainId === _userTraining.domainId
              )
              const followupName = simulations.find(
                (_simulation) => _simulation._id === userFollowup?.simulationId
              )?.name
              return (
                <TableRow>
                  <TableCell className="usercard-body-cell">
                    {domainName}
                  </TableCell>
                  <TableCell className="usercard-body-cell">
                    {progress}
                  </TableCell>
                  <TableCell>{`${
                    isNaN(Math.ceil((quizScore / totalScore) * 100))
                      ? 0
                      : Math.ceil((quizScore / totalScore) * 100)
                  }%`}</TableCell>
                  <TableCell className="usercard-body-cell">
                    {/* started at */}
                    {_userTraining.startedAt
                      ? moment(_userTraining.startedAt).format(
                          'MM-DD-YYYY hh:mm:ss'
                        )
                      : null}
                  </TableCell>
                  <TableCell className="usercard-body-cell">
                    {/* completed at */}
                    {_userTraining.completedAt
                      ? moment(_userTraining.completedAt).format(
                          'MM-DD-YYYY hh:mm:ss'
                        )
                      : null}
                  </TableCell>
                  <TableCell className="usercard-body-cell">
                    {moment.utc(videoTime * 1000).format('HH:mm:ss')}
                  </TableCell>
                  <TableCell className="usercard-body-cell">
                    {/* {expectedTime} */}
                    {moment.utc(expectedTime * 1000).format('HH:mm:ss')}
                  </TableCell>
                  <TableCell className="usercard-body-cell">
                    {/* over/under time */}
                    {moment
                      .utc(Math.abs(videoTime - expectedTime) * 1000)
                      .format('HH:mm:ss')}
                  </TableCell>
                  <TableCell className="usercard-body-cell">
                    {/* followup */}
                    {followupName}
                  </TableCell>
                </TableRow>
              )
            } catch (error) {
              console.log(error)
            }
          })}
        </TableBody>
      </Table>

      {state.isOpen ? (
        <Stack spacing={2}>
          {/* //FIXME - 나중에 수정 */}
          {/* <FindingScore user={user} assessment={assessment} />

          <ComplianceCalculationScore />

          <ProcessIssues />

          <UnidentifiedFindings assessment={assessment} />

          <MonitoringNotes assessment={assessment} />

          <Confidential /> */}
        </Stack>
      ) : null}
    </Box>
  )
})
