import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'

import Domain from 'src/models/domain'
import _ from 'lodash'
import { observer } from 'mobx-react'

type Props = {
  overallsByUser: {
    headers: string[]
    rows: {
      [userId: string]: {
        userName: string
        isUserActivated: string
        id: string
        userTitle: string
        countryName: string
        vendor: string
        bu: string
        region: string
        exp: string
        clinicalExp: string
        intDev: string
        type: string
        degree: string
        certification: string
        manager: string
        scoreByDomain: string[]
        domainTotal: string
        criticalIdentified: string
        majorIdentified: string
        minorIdentified: string
        time: string
        numberOfPillsTaken: string
        numberOfPillsShouldTaken: string
        compliancePercent: string
        rescueMedication: string
        numberOfMonitoringNotes: string
        distributedDate: string
        reviewedBaselineResult: string
        baselineScoreByDomain: {
          text: string
          assigned: boolean
          passed: boolean
        }[]
        numberOfTrainingModuleAssigned: string
        followupScoreByDomain: {
          text: string
          assigned: boolean
          passed: boolean
          isCompleted: boolean
        }[]
        difference: {
          text: string
          passed: boolean
        }[]
        quizScore: { text: string; assigned: boolean; isCompleted: boolean }[]
        trainingModulesRemaining: string
        followupSimulationRemaining: string
        isAllModulesCompleted: string
        unusualBehavior: string
        minimumEffort: string
        grade: string
      }
    }
  }
  domains: Domain[]
}

const OverallUsersView = ({ overallsByUser, domains }: Props) => {
  return (
    <Box sx={{ maxWidth: '100vw', overflowX: 'auto' }}>
      <Table sx={{ width: 'max-content' }} id={'datadump-overallusers-table'}>
        <TableHead>
          <TableRow>
            {overallsByUser.headers.map((_header) => (
              <TableCell className="datadump-head-cell" align={'center'}>
                {_header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(overallsByUser.rows).map((key) => {
            const row = overallsByUser.rows[key]
            return (
              <TableRow key={key}>
                <TableCell className="datadump-body-cell">
                  {row.userName}
                </TableCell>
                <TableCell className="datadump-body-cell" align={'center'}>
                  {row.isUserActivated}
                </TableCell>
                <TableCell className="datadump-body-cell" align={'center'}>
                  {row.id}
                </TableCell>
                <TableCell className="datadump-body-cell" align={'center'}>
                  {row.userTitle}
                </TableCell>
                <TableCell className="datadump-body-cell" align={'center'}>
                  {row.countryName}
                </TableCell>
                <TableCell className="datadump-body-cell" align={'center'}>
                  {row.vendor}
                </TableCell>
                <TableCell className="datadump-body-cell" align={'center'}>
                  {row.bu}
                </TableCell>
                <TableCell className="datadump-body-cell" align={'center'}>
                  {row.region}
                </TableCell>
                <TableCell className="datadump-body-cell" align={'center'}>
                  {row.exp}
                </TableCell>
                <TableCell className="datadump-body-cell" align={'center'}>
                  {row.clinicalExp}
                </TableCell>
                <TableCell className="datadump-body-cell" align={'center'}>
                  {row.intDev}
                </TableCell>
                <TableCell className="datadump-body-cell" align={'center'}>
                  {row.type}
                </TableCell>
                <TableCell className="datadump-body-cell" align={'center'}>
                  {row.degree}
                </TableCell>
                <TableCell className="datadump-body-cell" align={'center'}>
                  {row.certification}
                </TableCell>
                <TableCell className="datadump-body-cell" align={'center'}>
                  {row.manager}
                </TableCell>
                {row.scoreByDomain.map((score) => {
                  return (
                    <TableCell className="datadump-body-cell" align={'center'}>
                      {score}
                    </TableCell>
                  )
                })}
                <TableCell className="datadump-body-cell" align={'center'}>
                  {row.domainTotal}
                </TableCell>
                <TableCell className="datadump-body-cell" align={'center'}>
                  {row.criticalIdentified}
                </TableCell>
                <TableCell className="datadump-body-cell" align={'center'}>
                  {row.majorIdentified}
                </TableCell>
                <TableCell className="datadump-body-cell" align={'center'}>
                  {row.minorIdentified}
                </TableCell>
                <TableCell className="datadump-body-cell" align={'center'}>
                  {row.time}
                </TableCell>
                <TableCell className="datadump-body-cell" align={'center'}>
                  {row.numberOfPillsTaken}
                </TableCell>
                <TableCell className="datadump-body-cell" align={'center'}>
                  {row.numberOfPillsShouldTaken}
                </TableCell>
                <TableCell className="datadump-body-cell" align={'center'}>
                  {row.compliancePercent}
                </TableCell>
                <TableCell className="datadump-body-cell" align={'center'}>
                  {row.rescueMedication}
                </TableCell>
                <TableCell className="datadump-body-cell" align={'center'}>
                  {row.numberOfMonitoringNotes}
                </TableCell>
                <TableCell className="datadump-body-cell" align={'center'}>
                  {row.distributedDate}
                </TableCell>
                <TableCell className="datadump-body-cell" align={'center'}>
                  {row.reviewedBaselineResult}
                </TableCell>
                {row.baselineScoreByDomain.map((score) => {
                  const assigned = score.assigned
                  const passed = score.passed
                  return (
                    <TableCell
                      className="datadump-body-cell"
                      align={'center'}
                      sx={{
                        background: assigned
                          ? passed
                            ? '#54a54d'
                            : '#fc0d1b'
                          : undefined,
                      }}
                    >
                      {score.text}
                    </TableCell>
                  )
                })}
                <TableCell className="datadump-body-cell" align={'center'}>
                  {row.numberOfTrainingModuleAssigned}
                </TableCell>
                {row.followupScoreByDomain.map((score) => {
                  const assigned = score.assigned
                  const passed = score.passed
                  const text = score.text
                  const isCompleted = score.isCompleted
                  return (
                    <TableCell
                      className="datadump-body-cell"
                      align={'center'}
                      sx={{
                        backgroundColor:
                          text === '-'
                            ? '#ffff00'
                            : assigned
                            ? isCompleted
                              ? passed
                                ? '#54a54d'
                                : '#fc0d1b'
                              : '#ffff00'
                            : '#e9f3d4',
                      }}
                    >
                      {assigned && isCompleted ? score.text : '-'}
                    </TableCell>
                  )
                })}
                {row.difference.map((score) => {
                  const passed = score.passed
                  const text = score.text
                  return (
                    <TableCell
                      className="datadump-body-cell"
                      align={'center'}
                      sx={{
                        backgroundColor:
                          text === '-'
                            ? '#dbdcd9'
                            : passed
                            ? '#54a54d'
                            : '#fc0d1b',
                      }}
                    >
                      {score.text}
                    </TableCell>
                  )
                })}
                {row.quizScore.map((score) => {
                  const assigned = score.assigned
                  return (
                    <TableCell
                      className="datadump-body-cell"
                      align={'center'}
                      sx={{ backgroundColor: assigned ? '#e2e8f9' : undefined }}
                    >
                      {score.text}
                    </TableCell>
                  )
                })}
                <TableCell className="datadump-body-cell" align={'center'}>
                  {row.trainingModulesRemaining}
                </TableCell>
                <TableCell className="datadump-body-cell" align={'center'}>
                  {row.followupSimulationRemaining}
                </TableCell>
                <TableCell className="datadump-body-cell" align={'center'}>
                  {row.isAllModulesCompleted}
                </TableCell>
                <TableCell className="datadump-body-cell" align={'center'}>
                  {row.unusualBehavior}
                </TableCell>
                <TableCell className="datadump-body-cell" align={'center'}>
                  {row.minimumEffort}
                </TableCell>
                <TableCell className="datadump-body-cell" align={'center'}>
                  {row.grade}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Box>
  )
}

export default observer(OverallUsersView)
