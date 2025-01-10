import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { TrainingStatus, UserSimulationStatus } from 'src/utils/status'
import { blue, green, grey, yellow } from '@mui/material/colors'

import Domain from 'src/models/domain'
import { ScoreByDomain } from 'src/models/userSimulation/userSimulation.interface'
import UserSimulation from 'src/models/userSimulation'
import UserTraining from 'src/models/userTraining'
import moment from 'moment'
import { observer } from 'mobx-react'

type StatusSummaryProps = {
  userBaseline: UserSimulation
  byDomains: {
    domain: Domain
    userFollowup: UserSimulation
    userTraining: UserTraining
    userBaselineResultByMainDomain: ScoreByDomain
  }[]
}

export default observer((props: StatusSummaryProps) => {
  const { userBaseline, byDomains } = props

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell className="usercard-head-cell" align="center">
            Domain
          </TableCell>
          <TableCell className="usercard-head-cell" align="center">
            Baseline
          </TableCell>
          <TableCell className="usercard-head-cell" align="center">
            Training
          </TableCell>
          <TableCell className="usercard-head-cell" align="center">
            Followup
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {byDomains.map((_byDomain, index: any) => {
          return (
            <TableRow>
              <TableCell className="usercard-body-cell">
                {_byDomain?.domain.name}
              </TableCell>
              {index === 0 ? (
                <TableCell
                  className="usercard-body-cell"
                  sx={{
                    bgcolor:
                      userBaseline?.status ===
                        UserSimulationStatus.HasNotAssigned ||
                      userBaseline?.status === UserSimulationStatus.Assigned ||
                      userBaseline?.status === UserSimulationStatus.InProgress
                        ? yellow[500]
                        : green[500],
                    fontWeight: 700,
                    width: '152px',
                  }}
                  align="center"
                  rowSpan={5}
                >
                  {userBaseline?.submittedAt
                    ? moment(userBaseline?.submittedAt).format('DD-MMM-YYYY')
                    : '-'}
                </TableCell>
              ) : null}
              {_byDomain.userTraining ? (
                <TableCell
                  className="usercard-body-cell"
                  sx={{
                    color: 'white',
                    bgcolor:
                      _byDomain?.userTraining?.status ===
                      TrainingStatus.HasNotStarted
                        ? yellow[500]
                        : _byDomain?.userTraining?.status ===
                          TrainingStatus.HasNotAssigned
                        ? yellow[500]
                        : green[500],
                    fontWeight: 700,
                    width: '152px',
                  }}
                  align="center"
                >
                  {_byDomain?.userTraining?.status ===
                  TrainingStatus.HasNotStarted
                    ? 'Pending'
                    : _byDomain?.userTraining?.status ===
                      TrainingStatus.HasNotAssigned
                    ? 'N/A'
                    : moment(_byDomain?.userTraining?.updatedAt).format(
                        'DD-MMM-YYYY'
                      )}
                </TableCell>
              ) : (
                <TableCell
                  className="usercard-body-cell"
                  sx={{
                    color: 'white',
                    bgcolor: grey[500],
                    fontWeight: 700,
                    width: '152px',
                  }}
                  align="center"
                >
                  -
                </TableCell>
              )}
              {_byDomain.userFollowup ? (
                <TableCell
                  className="usercard-body-cell"
                  sx={{
                    color: 'white',
                    bgcolor:
                      _byDomain?.userFollowup?.status ===
                      UserSimulationStatus.Assigned
                        ? yellow[500]
                        : _byDomain?.userFollowup?.status ===
                          UserSimulationStatus.HasNotAssigned
                        ? _byDomain?.userTraining?.status ===
                          TrainingStatus.HasNotStarted
                          ? yellow[500]
                          : _byDomain?.userTraining?.status ===
                            TrainingStatus.HasNotAssigned
                          ? yellow[500]
                          : green[500]
                        : green[500],
                    fontWeight: 700,
                    width: '152px',
                  }}
                  align="center"
                >
                  {(() => {
                    switch (_byDomain?.userFollowup?.status) {
                      case UserSimulationStatus.HasNotAssigned: {
                        if (
                          _byDomain?.userTraining?.status ===
                          TrainingStatus.HasNotAssigned
                        ) {
                          return 'N/A'
                        }
                        return 'Pending'
                      }
                      case UserSimulationStatus.Assigned: {
                        return 'Pending'
                      }
                      case UserSimulationStatus.InProgress: {
                        return 'Pending'
                      }
                      case UserSimulationStatus.Pending: {
                        return moment(
                          _byDomain?.userFollowup?.submittedAt
                        ).format('DD-MMM-YYYY')
                      }
                      case UserSimulationStatus.Scoring: {
                        return moment(
                          _byDomain?.userFollowup?.submittedAt
                        ).format('DD-MMM-YYYY')
                      }
                      case UserSimulationStatus.Adjudicating: {
                        return moment(
                          _byDomain?.userFollowup?.submittedAt
                        ).format('DD-MMM-YYYY')
                      }
                      case UserSimulationStatus.Published: {
                        return moment(
                          _byDomain?.userFollowup?.submittedAt
                        ).format('DD-MMM-YYYY')
                      }
                      case UserSimulationStatus.Distributed: {
                        return moment(
                          _byDomain?.userFollowup?.submittedAt
                        ).format('DD-MMM-YYYY')
                      }
                      case UserSimulationStatus.Reviewed: {
                        return moment(
                          _byDomain?.userFollowup?.submittedAt
                        ).format('DD-MMM-YYYY')
                      }
                      case UserSimulationStatus.Exported: {
                        return moment(
                          _byDomain?.userFollowup?.submittedAt
                        ).format('DD-MMM-YYYY')
                      }
                      default: {
                        return '-'
                      }
                    }
                  })()}
                </TableCell>
              ) : (
                <TableCell
                  className="usercard-body-cell"
                  sx={{
                    color: 'white',
                    bgcolor: grey[500],
                    fontWeight: 700,
                    width: '152px',
                  }}
                  align="center"
                >
                  -
                </TableCell>
              )}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
})
