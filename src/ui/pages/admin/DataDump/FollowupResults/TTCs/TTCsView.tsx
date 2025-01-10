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
  totalTimesToComplete: { mean: number; high: number; low: number }
}

// Total Time To Complete
const TTCTableView = ({ totalTimesToComplete }: Props) => {
  const columns = [
    {
      name: '',
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
    <Table sx={{ width: 'max-content' }} id={'datadump-ttcs-table'}>
      <TableHead>
        <TableRow>
          <TableCell
            sx={{ minWidth: '196px' }}
            className="datadump-head-cell"
            align={'center'}
          ></TableCell>
          <TableCell
            sx={{ minWidth: '128px' }}
            className="datadump-head-cell"
            align={'center'}
          >
            Mean
          </TableCell>
          <TableCell
            sx={{ minWidth: '128px' }}
            className="datadump-head-cell"
            align={'center'}
          >
            High
          </TableCell>
          <TableCell
            sx={{ minWidth: '128px' }}
            className="datadump-head-cell"
            align={'center'}
          >
            Low
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell className="datadump-body-cell">
            Total Time to Complete
          </TableCell>
          <TableCell className="datadump-body-cell" align={'center'}>
            {totalTimesToComplete.mean}
          </TableCell>
          <TableCell className="datadump-body-cell" align={'center'}>
            {totalTimesToComplete.high}
          </TableCell>
          <TableCell className="datadump-body-cell" align={'center'}>
            {totalTimesToComplete.low}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export default observer(TTCTableView)
