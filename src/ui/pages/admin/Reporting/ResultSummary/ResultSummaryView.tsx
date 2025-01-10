import { AnswerStatus, TrainingStatus } from 'src/utils/status'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import { green, grey, yellow } from '@mui/material/colors'

import Assessment from 'src/models/assessment'
import Domain from 'src/models/domain'
import IDomain from 'src/models/domain/domain.interface'
import ResultSummary from './ResultSummary'
import { ScoreByDomain } from 'src/models/userSimulation/userSimulation.interface'
import UserSimulation from 'src/models/userSimulation'
import UserTraining from 'src/models/userTraining'
import compose from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { withFind } from '@hocs'

type ResultSummaryProps = {
  byDomains: {
    domain: Domain
    userFollowup: UserSimulation
    userTraining: UserTraining
    userBaselineResultByMainDomain: ScoreByDomain
    userFollowupResultByMainDomain: ScoreByDomain
  }[]
}

const ResultsSummaryView = observer((props: ResultSummaryProps) => {
  const { byDomains } = props
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
        {byDomains.map((_byDomain) => (
          <TableRow>
            <TableCell className="usercard-body-cell">
              {_byDomain?.domain?.name}
            </TableCell>
            <TableCell
              className="usercard-body-cell"
              align="center"
              sx={{
                width: '152px',
                color: 'white',
                bgcolor:
                  typeof _byDomain?.userBaselineResultByMainDomain?.pass ===
                  'boolean'
                    ? _byDomain?.userBaselineResultByMainDomain?.pass
                      ? green[500]
                      : yellow[500]
                    : grey[500],
                fontWeight: 700,
              }}
            >
              {_byDomain?.userBaselineResultByMainDomain?.score?.toFixed(0)}%
            </TableCell>
            <TableCell
              className="usercard-body-cell"
              align="center"
              sx={{
                width: '152px',
                color: 'white',
                bgcolor: _byDomain?.userTraining?.status
                  ? _byDomain?.userTraining?.status ===
                      TrainingStatus.HasNotAssigned ||
                    _byDomain?.userTraining?.status ===
                      TrainingStatus.HasNotStarted
                    ? grey[500]
                    : green[500]
                  : grey[500],
                // FIXME - add color logic
                fontWeight: 700,
              }}
            >
              {_byDomain?.userTraining?.status
                ? _byDomain?.userTraining?.status ===
                    TrainingStatus.HasNotAssigned ||
                  _byDomain?.userTraining?.status ===
                    TrainingStatus.HasNotStarted
                  ? '-'
                  : Object.values(
                      _byDomain?.userTraining?.progresses || {}
                    ).reduce((acc, cur) => {
                      return acc + cur.quizScore
                    }, 0)
                : '-'}
            </TableCell>
            <TableCell
              className="usercard-body-cell"
              align="center"
              sx={{
                width: '152px',
                color: 'white',
                bgcolor:
                  typeof _byDomain?.userFollowupResultByMainDomain?.pass ===
                  'boolean'
                    ? _byDomain?.userFollowupResultByMainDomain?.pass
                      ? green[500]
                      : yellow[500]
                    : grey[500],
                fontWeight: 700,
              }}
            >
              {typeof _byDomain?.userFollowupResultByMainDomain?.score ===
              'number'
                ? `${_byDomain?.userFollowupResultByMainDomain?.score?.toFixed(
                    0
                  )}%`
                : '-'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
})

const ResultsSummary = compose<any>(
  withFind({
    collectionName: 'domains',
    version: 2,
    getFilter: () => ({
      depth: 0,
      followupNumber: { $gt: 0 },
      isDeleted: false,
    }),
  })
)(ResultsSummaryView)

export default ResultsSummary

// type DomainProps = {
//   domainId: string
//   score: number
// }

// const Domain = observer((props: DomainProps) => {
//   const { domainId, score } = props

//   return (
//     <TableRow>
//       <TableCell>{domainId}</TableCell>
//       <TableCell>{score}%</TableCell>
//       <TableCell>training</TableCell>
//       <TableCell>followup</TableCell>
//
//     </TableRow>
//   )
// })

// type DomainsViewProps = {
//   assessment: Assessment
//   domains: IDomain[]
// }

// const DomainsView = observer((props: DomainsViewProps) => {
//   const { assessment, domains } = props
//   // @ts-ignore
//   const answersGroupedByDomain = _.groupBy(
//     assessment.answers,
//     (answer) => answer.finding?.domain?.name
//   )
//   const domainKeys = Object.keys(answersGroupedByDomain)

//   return (
//     <Table>
//       <TableHead>
//         <TableRow>
//           <TableCell>Domain</TableCell>
//           <TableCell>% Identified</TableCell>
//           <TableCell>Identified</TableCell>
//           <TableCell>Not Identified</TableCell>
//           <TableCell>Total</TableCell>
//         </TableRow>
//       </TableHead>
//       <TableBody>
//         {domainKeys.map((key) => {
//           const correctAnswerCount = answersGroupedByDomain[key]?.filter(
//             (answer) =>
//               answer.scoring.adjudicator.answerStatus === AnswerStatus.Correct
//           )?.length
//           const incorrectAnswerCount = answersGroupedByDomain[key]?.filter(
//             (answer) =>
//               answer.scoring.adjudicator.answerStatus === AnswerStatus.InCorrect
//           )?.length
//           const totalCount = answersGroupedByDomain[key]?.length
//           const identified = (correctAnswerCount / totalCount) * 100

//           return (
//             <TableRow>
//               <TableCell>{key}</TableCell>
//               <TableCell>{Math.round(identified)}%</TableCell>
//               <TableCell>{correctAnswerCount}</TableCell>
//               <TableCell>{incorrectAnswerCount}</TableCell>
//               <TableCell>{totalCount}</TableCell>
//             </TableRow>
//           )
//         })}
//       </TableBody>
//     </Table>
//   )
// })

// const Domains = compose<any>(
//   withFind({
//     collectionName: 'domains',
//     version: 2,
//     getFilter: () => ({ depth: 1 }),
//   })
// )(DomainsView)
