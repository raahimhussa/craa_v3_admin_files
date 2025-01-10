import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'

import AssessmentType from 'src/models/assessmentType'
import { SimulationType } from 'src/utils/status'
import _ from 'lodash'
import { observer } from 'mobx-react'

type Props = {
  onClickSelectDataDump: (
    simulationType: SimulationType,
    domainId: string
  ) => void
  assessmentType: AssessmentType
  assessmentCycleId: string
}

const SimulationGroupsView = ({
  onClickSelectDataDump,
  assessmentType,
}: Props) => {
  return (
    <Table sx={{ mb: '32px' }}>
      <Box>{assessmentType.label}</Box>
      <TableBody>
        <TableRow>
          <TableCell>{assessmentType.baseline?.label}</TableCell>
          <TableCell>
            <Button
              onClick={() => onClickSelectDataDump(SimulationType.Baseline, '')}
            >
              Start Datadump
            </Button>
          </TableCell>
          <TableCell>
            <Button>Start Doc-Comp Datadump</Button>
          </TableCell>
        </TableRow>
        {assessmentType.followups.map((_followup) => (
          <TableRow>
            <TableCell>{_followup.label}</TableCell>
            <TableCell>
              <Button
                onClick={() =>
                  onClickSelectDataDump(
                    SimulationType.Followup,
                    _followup.domain._id
                  )
                }
              >
                Start Datadump
              </Button>
            </TableCell>
            <TableCell>
              <Button>Start Doc-Comp Datadump</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default observer(SimulationGroupsView)
