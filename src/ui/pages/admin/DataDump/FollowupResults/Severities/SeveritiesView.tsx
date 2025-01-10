import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'

import _ from 'lodash'
import { observer } from 'mobx-react'

type Props = {
  scoresBySeverity: {
    [severity: number]: { mean: number; high: number; low: number }
  }
}

const SeveritiesView = ({ scoresBySeverity }: Props) => {
  const severities = {
    0: 'Critical',
    1: 'Major',
    2: 'Minor',
  }
  const columns = [
    {
      name: 'Serverity Score',
    },
    {
      name: 'Mean',
    },
    {
      name: 'High',
    },
    {
      name: 'Low',
    },
  ]
  return (
    <Table sx={{ width: 'max-content' }} id={'datadump-severities-table'}>
      <TableHead>
        <TableRow>
          {columns.map((col) => {
            return (
              <TableCell
                sx={{ minWidth: '154px' }}
                className="datadump-head-cell"
                align={'center'}
              >
                {col.name}
              </TableCell>
            )
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.keys(scoresBySeverity).map((key) => {
          const severity = Number(key) as 0 | 1 | 2
          return (
            <TableRow>
              <TableCell
                className="datadump-body-cell"
                sx={{ lineHeight: '72px' }}
                align={'center'}
              >
                {severities[severity] || ''}
              </TableCell>
              <TableCell className="datadump-body-cell" align="center">
                {scoresBySeverity[severity].mean || '-'}
              </TableCell>
              <TableCell className="datadump-body-cell" align="center">
                {scoresBySeverity[severity].high || '-'}
              </TableCell>
              <TableCell className="datadump-body-cell" align="center">
                {scoresBySeverity[severity].low || '-'}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default observer(SeveritiesView)
