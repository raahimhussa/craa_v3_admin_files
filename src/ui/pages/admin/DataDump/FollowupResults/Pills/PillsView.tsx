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
  pills: {
    documentId: number
    documentName: string
    numberOfPillsTakenBySubject: string
    numberOfPillsPrescribed: string
    percentCompliance: string
    rescueMedication: string
  }[]
}

const PillsView = ({ pills }: Props) => {
  const orderedPills = pills.sort((a, b) =>
    a.documentId - b.documentId > 0 ? 1 : -1
  )
  return (
    <Box sx={{ maxWidth: '100vw', overflowX: 'auto' }}>
      <Table sx={{ width: 'max-content' }} id={'datadump-pills-table'}>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{ minWidth: '196px' }}
              className="datadump-head-cell"
              align={'center'}
            >
              Description
            </TableCell>
            {orderedPills.map((_pill) => (
              <TableCell
                sx={{ minWidth: '320px' }}
                className="datadump-head-cell"
                align={'center'}
              >
                {_pill.documentName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell
              sx={{ minWidth: '196px' }}
              className="datadump-head-cell"
              align={'center'}
            >
              Number of pills taken by subject
            </TableCell>
            {orderedPills.map((_pill) => (
              <TableCell
                sx={{ minWidth: '320px' }}
                className="datadump-head-cell"
                align={'center'}
              >
                {_pill.numberOfPillsTakenBySubject}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell
              sx={{ minWidth: '196px' }}
              className="datadump-head-cell"
              align={'center'}
            >
              Number of pills that should have been taken by subject
            </TableCell>
            {orderedPills.map((_pill) => (
              <TableCell
                sx={{ minWidth: '320px' }}
                className="datadump-head-cell"
                align={'center'}
              >
                {_pill.numberOfPillsPrescribed}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell
              sx={{ minWidth: '196px' }}
              className="datadump-head-cell"
              align={'center'}
            >
              Percent (%) Compliance
            </TableCell>
            {orderedPills.map((_pill) => (
              <TableCell
                sx={{ minWidth: '320px' }}
                className="datadump-head-cell"
                align={'center'}
              >
                {_pill.percentCompliance}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell
              sx={{ minWidth: '196px' }}
              className="datadump-head-cell"
              align={'center'}
            >
              Rescue Medication
            </TableCell>
            {orderedPills.map((_pill) => (
              <TableCell
                sx={{ minWidth: '320px' }}
                className="datadump-head-cell"
                align={'center'}
              >
                {_pill.rescueMedication}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  )
}

export default observer(PillsView)
